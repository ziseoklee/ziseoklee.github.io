/*-----------------------------------------------------------------------------

4190.308-001 Computer Architecture

Instructor: Prof. Jae W. Lee (jaewlee@snu.ac.kr)

Homework #3: RISC-V Pipeline in Verilog

Description:
	This module is your verilog pipeline.

-----------------------------------------------------------------------------*/

module riscv_pipeline
(
	input clk,
	input reset
);

	//IF stage
	reg [63:0] IF_pc;
	wire [31:0] IF_inst;

	//ID stage
	reg [31:0] ID_inst;

	wire [6:0] ID_opcode;
	wire [2:0] ID_funct3;
	wire [6:0] ID_funct7;
	wire [4:0] ID_rs1, ID_rs2, ID_rd;
	wire [63:0] ID_rf_data_rs1, ID_rf_data_rs2;
	wire [63:0] ID_rs1_data, ID_rs2_data;
	wire [63:0] ID_imm64;
	wire ID_alu_src;
	wire ID_mem_to_reg;
	wire ID_reg_write;
	wire ID_mem_read;
	wire ID_mem_write;
	wire [2:0] ID_alu_op;
	wire ID_halt;

	//EX stage
	reg [63:0] EX_rs1_data, EX_rs2_data;
	reg [63:0] EX_imm64;
	reg [4:0] EX_rd;
	reg EX_alu_src;
	reg EX_mem_to_reg;
	reg EX_reg_write;
	reg EX_mem_read;
	reg EX_mem_write;
	reg [2:0] EX_alu_op;
	reg EX_halt;

    //alu
	wire [63:0] alu_lhs, alu_rhs, EX_alu_result;
	wire alu_zero, alu_sign;

	//Mem stage
	reg [63:0] MEM_rs2_data;
	reg [63:0] MEM_alu_result;
	reg MEM_zero, MEM_sign;
	reg [4:0] MEM_rd;
	reg MEM_mem_to_reg;
	reg MEM_reg_write;
	reg MEM_mem_read;
	reg MEM_mem_write;
	reg MEM_halt;
	
	wire [63:0] MEM_read_data;

	//WB stage
	reg [63:0] WB_alu_result;
	reg [63:0] WB_mem_rddata;
	reg [4:0] WB_rd;
	reg WB_reg_write;
	reg WB_mem_to_reg;

	wire [63:0] WB_write_data;
	
	//Newly declared wires and registers
	reg [63:0] ID_pc, EX_pc, MEM_target_pc;
	reg EX_PCSrc;
	wire [63:0] EX_target_pc, target_pc;
	wire PCSrc, ID_PCSrc, ctl_branch, ctl_zero;
	wire ID_branch;
	reg EX_branch;
	reg MEM_branch;
	reg [4:0] EX_rs1, EX_rs2;  // register numbers, EX_rd, MEM_rd already implemented
	wire [1:0] ForwardA, ForwardB; // forward to EXE stage for alu operation
	wire [1:0] ForwardC, ForwardD; // forward to ID stage for branch decision
	wire LoadUseHazard, BranchHazardStall, hazarded;
	wire [63:0] EX_fwd_rs2_data;
	wire [63:0] ID_target_pc;
	wire [63:0] ID_fwd_rs1_data, ID_fwd_rs2_data;
	reg branchStall;
	
	//--------------------IF stage-----------------------
	// rom64 imem(PCSrc ? ID_target_pc : IF_pc, IF_inst);
	rom64 imem(IF_pc, IF_inst);
 
	always @(posedge clk)
	begin
		IF_pc	<= reset ? 64'h0 : (hazarded ? IF_pc : (PCSrc ? ID_target_pc : IF_pc + 4));
		ID_pc   <= reset ? 64'h0 : (hazarded ? ID_pc : IF_pc);
		ID_inst	<= reset ? 32'h0 : (hazarded ? ID_inst : IF_inst);
		branchStall <= reset|hazarded ? 1'b0 : PCSrc;
		// IF_pc	<= reset ? 64'h0 : (PCSrc ? ID_target_pc + 4 : (hazarded ? IF_pc : IF_pc + 4));
		// ID_pc   <= reset ? 64'h0 : (hazarded ? ID_pc : PCSrc ? ID_target_pc : IF_pc);
	end

	//--------------------ID stage-----------------------

	inst_decoder id_unit(
	            .inst(ID_inst),
				.opcode(ID_opcode),
				.funct3(ID_funct3),
				.funct7(ID_funct7),
				.rs1(ID_rs1),
				.rs2(ID_rs2),
				.rd(ID_rd),
				.imm64(ID_imm64));
	pipeline_ctl id_ctl(	.opcode(ID_opcode),
				.funct3(ID_funct3),
				.funct7(ID_funct7),
				.hazarded(hazarded || branchStall),
				.alu_src(ID_alu_src),
				.mem_to_reg(ID_mem_to_reg),
				.reg_write(ID_reg_write),
				.mem_read(ID_mem_read),
				.mem_write(ID_mem_write),
				.alu_operation(ID_alu_op),
				.halt(ID_halt),
				.branch(ID_branch)
				);
				
    // Hazard Detection Unit (combinational unit)
    assign hazarded = LoadUseHazard || BranchHazardStall; // stall for data hazards
	assign LoadUseHazard = EX_mem_read && ((EX_rd == ID_rs1) | (EX_rd == ID_rs2));
	assign BranchHazardStall = (ID_opcode == 7'b1100011) && ( ((EX_alu_op != EX_alu.ALU_NOP) && EX_reg_write && ((EX_rd == ID_rs1) || (EX_rd == ID_rs2)))
	                           || (MEM_mem_read && MEM_reg_write && ((MEM_rd == ID_rs1) || (MEM_rd == ID_rs2)))
	                           || (EX_mem_read && EX_reg_write && ((EX_rd == ID_rs1) || (EX_rd == ID_rs2))));
	
    // Branch Decision
    assign ID_target_pc = reset ? 64'b0 : ID_pc + (ID_imm64 << 1);
    assign PCSrc = reset|branchStall ? 1'b0 : (ID_opcode == 7'b1100011) && (ID_fwd_rs1_data == ID_fwd_rs2_data);
    
    // Forwarding Unit for Branch Decision
    assign ForwardC = reset|!ID_branch ? 2'b00
	                   : WB_mem_to_reg && (WB_rd !=0) && (WB_rd == ID_rs1) ? 2'b01 // load-use hazard forwarding
	                   : WB_reg_write && (WB_rd != 0) && !(MEM_reg_write && (MEM_rd != 0) && (MEM_rd == ID_rs1)) && (WB_rd == ID_rs1) ? 2'b01
	                   : MEM_reg_write && (MEM_rd != 0) && (MEM_rd == ID_rs1) ? 2'b10
	                   : 2'b00;
	assign ForwardD = reset|!ID_branch ? 2'b00
	                   : WB_mem_to_reg && (WB_rd !=0) && (WB_rd == ID_rs2) ? 2'b01
	                   : WB_reg_write && (WB_rd != 0) && !(MEM_reg_write && (MEM_rd != 0) && (MEM_rd == ID_rs2)) && (WB_rd == ID_rs2) ? 2'b01
	                   : MEM_reg_write && (MEM_rd != 0) && (MEM_rd == ID_rs2) ? 2'b10
	                   : 2'b00;
	assign ID_fwd_rs1_data = (ForwardC == 2'b00) ? ID_rf_data_rs1
	                   : (ForwardC == 2'b10) ? MEM_alu_result
	                   : (ForwardC == 2'b01) ? WB_write_data
	                   : 64'h0;
    assign ID_fwd_rs2_data = (ForwardD == 2'b00) ? ID_rf_data_rs2
	                   : (ForwardD == 2'b10) ? MEM_alu_result
	                   : (ForwardD == 2'b01) ? WB_write_data
	                   : 64'h0;

	//--------------------ID/WB stage-----------------------
	// We use inverted clk signal to enable "write-back" and "register read" occur at the same time.
	reg_file id_regfile(	.clk(~clk), .rs1(ID_rs1), .rs2(ID_rs2),
				.rs1_data(ID_rf_data_rs1),
				.rs2_data(ID_rf_data_rs2),
				.rd(WB_rd), .write(WB_reg_write),
				.write_data(WB_write_data));
    
	//ID/EX pipeline registers
	always @(posedge clk)
	begin
		EX_alu_src		<= reset ? 1'h0 : ID_alu_src;
		EX_mem_to_reg	<= reset ? 1'h0 : ID_mem_to_reg;
		EX_reg_write	<= reset ? 1'h0 : ID_reg_write;
		EX_mem_read		<= reset ? 1'h0 : ID_mem_read;
		EX_mem_write	<= reset ? 1'h0 : ID_mem_write;
		EX_alu_op		<= reset ? 3'h0 : ID_alu_op;
		EX_halt			<= reset ? 1'h0 : ID_halt;

		EX_rs1_data		<= reset ? 64'h0 : ID_fwd_rs1_data;
		EX_rs2_data		<= reset ? 64'h0 : ID_fwd_rs2_data;
		EX_imm64		<= reset ? 64'h0 : ID_imm64;
		EX_rd			<= reset ? 5'h0 : ID_rd;
		
		EX_rs1          <= reset ? 5'h0 : ID_rs1;
		EX_rs2          <= reset ? 5'h0 : ID_rs2;
	end

	//------------------EX stage-----------------------
	
	//Forwarding Unit (combinational circuit)
	assign ForwardA = reset ? 2'b00 
	                   : WB_mem_to_reg && (WB_rd !=0) && (WB_rd == EX_rs1) ? 2'b01 // load-use hazard forwarding
	                   : WB_reg_write && (WB_rd != 0) && !(MEM_reg_write && (MEM_rd != 0) && (MEM_rd == EX_rs1)) && (WB_rd == EX_rs1) ? 2'b01
	                   : MEM_reg_write && (MEM_rd != 0) && (MEM_rd == EX_rs1) ? 2'b10
	                   : 2'b00;
	assign ForwardB = reset ? 2'b00
	                   : WB_mem_to_reg && (WB_rd !=0) && (WB_rd == EX_rs2) ? 2'b01
	                   : WB_reg_write && (WB_rd != 0) && !(MEM_reg_write && (MEM_rd != 0) && (MEM_rd == EX_rs2)) && (WB_rd == EX_rs2) ? 2'b01
	                   : MEM_reg_write && (MEM_rd != 0) && (MEM_rd == EX_rs2) ? 2'b10
	                   : 2'b00;
	assign alu_lhs = (ForwardA == 2'b00) ? EX_rs1_data
	                   : (ForwardA == 2'b10) ? MEM_alu_result
	                   : (ForwardA == 2'b01) ? WB_write_data
	                   : 64'h0;
	assign alu_rhs = EX_alu_src ? EX_imm64
	                   : EX_fwd_rs2_data;
    assign EX_fwd_rs2_data = (ForwardB == 2'b00) ? EX_rs2_data
	                   : (ForwardB == 2'b10) ? MEM_alu_result
	                   : (ForwardB == 2'b01) ? WB_write_data
	                   : 64'h0;
    
	//ALU
	alu EX_alu(	.op(EX_alu_op),
			.lhs(alu_lhs), .rhs(alu_rhs),
			.result(EX_alu_result),
			.zero(alu_zero), .sign(alu_sign));
			
	// assign EX_target_pc = EX_pc + (EX_imm64 << 1);
    
	//EX/MEM pipeline registers
	always @(posedge clk)
	begin
		MEM_mem_to_reg	<= reset ? 1'h0 : EX_mem_to_reg;
		MEM_reg_write	<= reset ? 1'h0 : EX_reg_write;
		MEM_mem_read	<= reset ? 1'h0 : EX_mem_read;
		MEM_mem_write	<= reset ? 1'h0 : EX_mem_write;
		MEM_halt		<= reset ? 1'h0 : EX_halt;

		//MEM_rs2_data	<= reset|PCSrc ? 64'h0 : EX_rs2_data;
		MEM_rs2_data	<= reset ? 64'h0 : EX_fwd_rs2_data;
		MEM_alu_result	<= reset ? 64'h0 : EX_alu_result;
		MEM_zero		<= reset ? 1'h0 : alu_zero;
		MEM_sign		<= reset ? 1'h0 : alu_sign;
		MEM_rd			<= reset ? 5'h0 : EX_rd;
		
		// MEM_target_pc   <= reset|PCSrc ? 64'h0 : EX_target_pc;
		// MEM_branch      <= reset|PCSrc ? 1'h0 : EX_branch;
	end

	//--------------------Mem stage------------------------
    // assign target_pc = MEM_target_pc;
    
    // assign ctl_branch = MEM_branch;
    // assign ctl_zero = MEM_zero;
    // assign PCSrc = ctl_branch & ctl_zero;
    
	mem64 MEM_dmem(	.clk(clk),
			.write_enable(MEM_mem_write),
			.halt(MEM_halt),
			.address(MEM_alu_result),
			.write_data(MEM_rs2_data),
			.read_data(MEM_read_data));

	//MEM/WB pipeline registers
	always @(posedge clk)
	begin
		WB_reg_write	<= (reset) ? 1'h0 : MEM_reg_write;
		WB_rd			<= (reset) ? 5'h0 : MEM_rd;
		WB_alu_result	<= (reset) ? 64'h0 : MEM_alu_result;
		WB_mem_rddata	<= (reset) ? 64'h0 : MEM_read_data;
		WB_mem_to_reg	<= (reset) ? 1'h0 : MEM_mem_to_reg;
	end

	//--------------------WB stage-----------------------
	assign WB_write_data = WB_mem_to_reg ? WB_mem_rddata : WB_alu_result;

endmodule
