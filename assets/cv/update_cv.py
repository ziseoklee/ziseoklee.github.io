import asyncio
from playwright.async_api import async_playwright
import os
import bibtexparser
from bs4 import BeautifulSoup
import re

# Run python update_cv.py in this directory to update the CV
# Make sure to have the bibtexparser and playwright installed

pages = [
    "../../index.html",
    "../../publications_temp.html",
    "../../bio.html"
]
bib_file = "../../mypapers.bib"  # adjust path if needed


def parse_bib_file(bib_file_path):
    try:
        with open(bib_file_path, 'r', encoding='utf-8') as bibfile:
            db = bibtexparser.load(bibfile)
            publications = db.entries

            # Sort publications by year in descending order
            publications.sort(key=lambda x: int(x.get('year', '0')), reverse=True)
            return publications

    except FileNotFoundError:
        print(f"Error: The file '{bib_file_path}' was not found.")
        return []
    except Exception as e:
        print(f"An error occurred while parsing the BibTeX file: {e}")
        return []

def update_publications_page(html_file_path, bib_file_path, output_file_path):
    try:
        # Read the HTML template
        with open(html_file_path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'html.parser')

        # Parse the BibTeX file
        publications = parse_bib_file(bib_file_path)

        if not publications:
            print("No publications found. The output file will not be updated.")
            return

        # Find the list elements to populate
        pub_list = soup.find(id="publicationsList")
        ws_list = soup.find(id="workshopsList")
        pre_list = soup.find(id="preprintsList")

        # Clear existing content in the lists
        for ul in [pub_list, ws_list, pre_list]:
            if ul:
                ul.clear()

        # Iterate through publications and add to the correct list
        for pub in publications:
            title = pub.get('title', 'No Title')
            authors = pub.get('author', 'No Author')
            year = pub.get('year', 'No Year')
            url = pub.get('url', '#')
            journal_or_book = pub.get('journal', pub.get('booktitle', ''))

            list_item = f'<li><i><a href="{url}">{title}</a></i>, {authors}, {journal_or_book} ({year})</li>'
            
            # Use BeautifulSoup to create and append the new list item
            new_li = BeautifulSoup(list_item, 'html.parser').li
            
            lower_journal = journal_or_book.lower()
            
            if "arxiv" in lower_journal:
                if pre_list:
                    pre_list.append(new_li)
            elif "workshop" in lower_journal:
                if ws_list:
                    ws_list.append(new_li)
            else:
                if pub_list:
                    pub_list.append(new_li)

        # Write the modified HTML to a new file
        with open(output_file_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))
            print(f"Successfully updated and saved the file to '{output_file_path}'")

    except FileNotFoundError:
        print(f"Error: The HTML template file '{html_file_path}' was not found.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

    


async def main():
    temp_files = []

    html_template_file = '../../publications.html'  # The HTML file to be modified
    output_html_file = '../../publications_temp.html' # The new file to be created

    update_publications_page(html_template_file, bib_file, output_html_file)

    temp_files.append(output_html_file)

    try:
        # Read all page contents
        all_content = ""
        for html_file in pages:
            with open(html_file, "r", encoding="utf-8") as f:
                content = f.read()
            all_content += content #+ "<div style='page-break-after: always;'></div>\n"

        # Create temporary HTML
        cwd = os.getcwd()
        temp_html = os.path.join(cwd, "../../temp_full_cv.html")
        # temp_dir = tempfile.gettempdir()
        # temp_html = os.path.join(temp_dir, "temp_full_cv.html")
        temp_files.append(temp_html)
        with open(temp_html, "w", encoding="utf-8") as f:
            f.write(f"""
            <html>
            <head>
                <meta charset="utf-8"/>
                <title>Ziseok Lee CV</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
                <link rel="stylesheet" href="assets/css/main.css" />
                <style>
                    img, video, svg {{ width: 12rem !important; }}
                    .major h1 {{font-size: 3rem !important;}}
                    #header, #volunteer, #contact, #footer, hr {{ display: none !important; }}
                    #education, #interests, #research, #teaching, #paperList, #awards {{ padding: 1rem 0 0 0 !important; }}
                    #publicationsList, #workshopsList, #preprintsList {{ padding: 0 0 1rem 0 !important; }}
                    body, #main {{ background: #ffffff !important; margin: 0 !important; width: 100% !important; font-size: 90% !important; padding: 0.5rem !important; }}
                    * {{ background: #ffffff !important; }}
                    h1, h2, h3, h4, p, b, i, a, ul, ol, table {{ margin: 0 !important; padding: 0 !important; font-family: "Times New Roman", serif !important; }}
                </style>
            </head>
            <body>
                {all_content}
            </body>
            </html>
            """)
        contact_info = """
                <ul class="icons">
					<li><a href="https://www.linkedin.com/in/ziseok-lee-b6a51734b" class="icon brands fa-linkedin"><span class="label">LinkedIn</span></a></li>
					<li><a href="https://github.com/ziseoklee" class="icon brands fa-github"><span class="label">Github</span></a></li>
					<li><a href="https://ziseoklee.github.io/index.html#contact" class="icon solid fa-envelope"><span class="label">Email</span></a></li>
				</ul>
        """
        # Add contact info inside the class=major element
        with open(temp_html, "r+", encoding="utf-8") as f:
            content = f.read()
            # Use regex to find the first major section and insert contact info
            content = re.sub(r'(<header class="major">.*?</header>)', r'\1' + contact_info, content, flags=re.DOTALL)
            f.seek(0)
            f.write(content)
            f.truncate()

        # Generate PDF
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.set_viewport_size({"width": 1800, "height": 1800})
            await page.goto("file://" + temp_html, wait_until="networkidle")
            output_pdf = "Ziseok_Lee_CV.pdf"
            await page.pdf(
                path=output_pdf,
                format="A4",
                print_background=True,
                margin={"top":"1cm","bottom":"1cm","left":"1cm","right":"1cm"}
            )
            await browser.close()
            print(f"PDF generated at {output_pdf}")

    finally:
        for f in temp_files:
            if os.path.exists(f):
                os.remove(f)
        print("Temporary files removed.")

asyncio.run(main())

