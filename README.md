# Komp

Create files with boilerplate content

### Options

```bash
$komp --help

Usage: newcomp [options]

Options:

  -T, --template <name> File base template
  -v, --verbose         Verbose mode
  -h, --help            output usage information
  -V, --version         output the version number
```

### Install

```bash
npm -g install komp
```

### Config defaults

The scripts creates a configuration file (.komp) and a directory (comp-templates) with template(s) at project root folder (same as package.json) called .komp to set defaults values. If you want to create new templates you have to put inside [root]comp-templates folder. Notice how the base template is created at [root]/comp-templates/base

###.komp

Is a JSON format config file with:

- baseName. This name will be replaced by the name the user enter in the command.
- template. This is the name of the folder with the boilerplate files. This name also will replaced by the name user enter int the command.
- files: A list of extensions that komp will search in the template folder to create the files.

```json
{
    "baseName": "component",
    "template": "base",
    "files": [
        ".html",
        ".js",
        ".json",
        ".yaml",
        ".md",
        ".css",
        ".scss"
    ]
}
```

With this content in .komp file the komp command will search for this structure:
    
```
comp-templates (komp will create this folder)
└─ base
    ├─ component.html
    ├─ component.twig
    ├─ component.js
    ├─ component.json
    ├─ component.yaml
    ├─ component.md
    ├─ component.css
    └─ component.scss 
```

Komp ignore the files that finally don't exist in your HD.

You can have more than one "template" in your HD, for example.

```
comp-templates (komp will create this folder)
├─ base
│  ├─ component.html
│  ├─ component.js
│  ├─ component.json
│  ├─ component.yaml
│  ├─ README.md
│  ├─ component.css
│  └─ component.scss 
│
├─ @fractal
│  ├─ component.njk
│  ├─ config.yaml
│  └─ component.css 
│
└─ @simple
   └─ component.njk
```

To create a new component using a differente template use --template flag

```bash
komp new button --template fractal
```

This will create a folder and files in your HD like this:

*Note that komp will respect the EXTRA character you put in the template folders and files.
If you call to the fractal template, komp will looking for a folder that containt fractal in the name, and then let the extra char ( in this case the @ ). This way you can boilerplate the names too.*

```
button
└─ @button
   ├─ button.njk
   ├─ config.yaml
   └─ button.scss
```

### Examples

```bash
# Create .komp config file
komp init
```

```bash
# Create button component with default template
komp new button
```

```bash
# Create myCard component using the card template
komp new myCard --template card
```
