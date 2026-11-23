# Previous project pages

The previous ACE and default template pages are available at `/projects/archive/ACE/` and `/projects/archive/template/`. They load their original files from the corresponding `static/` directories, which are also used by the live pages.

To restore either page at its existing URL, run the corresponding command from the repository root. These commands remove the archive's base URL and restore the original search indexing setting.

```sh
sed '/^  <base href=/d; s/content="noindex, follow"/content="index, follow"/' projects/archive/ACE/index.html > projects/ACE/index.html
sed '/^  <base href=/d; s/content="noindex, follow"/content="index, follow"/' projects/archive/template/index.html > projects/template/index.html
```
