#! /usr/bin/env node

const path = require("path")
const fs = require("fs-extra")
const os = require("os")
const colors = require("colors")
const util = require("./util.js")
const findRoot = require("find-root")
const app = require("commander")

let ROOT
let INROOTFOLDER = false
try {
  ROOT = findRoot(process.cwd())
  INROOTFOLDER = true
} catch (e) {}

let ROOT_COMP_FOLDER = ROOT + "/comp-templates"

try {
	const comp = readConfigFile()
	ROOT_COMP_FOLDER = ROOT + "/comp-templates"
} catch (e) {}

const initConfigFile = (dir, base) => {
  if (!util.isFile(ROOT + "/"+dir+"/komp.config.json")) {
    console.log("Config file created.")
    fs.writeFileSync(
		ROOT + "/"+dir+"/komp.config.json",
      JSON.stringify(
        {
          baseName: "component",
		  basePath: base+"/components/modules",
		  baseDir: base,
          template: "base"
        },
        null,
        4
      )
    )
  }
}

// Create component folder and template files if doesn't exists
const initComponentFolder = (dir) => {
	ROOT_COMP_FOLDER = ROOT + "/"+dir+ "/comp-templates"
  if (!util.isDir(ROOT_COMP_FOLDER)) {
    fs.mkdirsSync(ROOT_COMP_FOLDER)
    fs.copySync(path.join(__dirname, "comp-templates"), ROOT_COMP_FOLDER)
    console.log("Template folder [comp-templates] created.")
  }
}

// Read config file
const readConfigFile = () => {
	try {
  		return (config = util.readConfig(ROOT+"/config", "komp.config.json"))
	} catch (e) {
		return (config = util.readConfig(ROOT, "komp.config.json"))
	}
}

// Custom comp-templates folder
//const ROOT_COMP_FOLDER = ROOT + "/comp-templates"

// Commander APP
// ----------------------------------------------------------------------------
app
  .version("1.0.0")
  .option("-T, --template <name>", "File base template", "base")
  .option("-F, --file", "File mode. Doesn`t create a folder", false)
  .command("new <name>")
  .alias("n")
  .description("Create new boilerplate folder/files")
  .action(function(env) {
    if (INROOTFOLDER) {
		const comp = readConfigFile()
		ROOT_COMP_FOLDER = ROOT + "/"+comp.baseDir+"/comp-templates"

		console.log(ROOT_COMP_FOLDER)
      if (!util.isDir(ROOT_COMP_FOLDER)) {
        console.log("Folder comp-templates doesn't exists, use komp init")
        process.exit(0)
      }

      // Read cofig file
      //const comp = readConfigFile()

      // Template from user
      if (app.template) comp.template = app.template

      // Full path
      const fullPath = path.join(comp.basePath, app.args[0])
      // name & dir
      const componentName = path.basename(fullPath)

      // Buscamos la carpeta de template
      const templateFolderName = fs.readdirSync(ROOT_COMP_FOLDER).filter(folder => {
        const searchSplit = folder.split(app.template)
        return searchSplit.length > 1
      })[0]

      const finalTemplateFolderName = templateFolderName.replace(app.template, componentName)

      let componentDir
      if (!app.file) {
        componentDir = `${path.dirname(fullPath)}/${finalTemplateFolderName}`
        try {
          fs.mkdirsSync(componentDir)
        } catch (e) {
          /* */
        }
      } else {
        componentDir = `${path.dirname(fullPath)}`
      }

      const files = fs.readdirSync(`${ROOT_COMP_FOLDER}/${templateFolderName}`)

      files.map(file => {
        const src_templatePath = `${ROOT_COMP_FOLDER}/${templateFolderName}`
        const src_fileContent = fs.readFileSync(src_templatePath + "/" + file, "utf8")
        const dst_fileContent = src_fileContent.replace(/@@name/g, componentName)
        const dst_templatePath = componentDir
        const dst_templateFile = file.replace(config.baseName, componentName)
        util.writeFile(dst_templatePath + "/" + dst_templateFile, dst_fileContent)
      })

      console.log("\n" + env + " component created :)\n")
    } else {
      console.log("Necesitas estar en una carpeta de proyecto (package.json)")
    }
  })

app
  .option("-C, --config <name>", "config folder", "config")
  .command("init <dir>")
  .alias("i")
  .description("Create config file and template folder")
  .action(function(env) {
    if (INROOTFOLDER) {
      initConfigFile(app.config)
      initComponentFolder(app.config, env)
    } else {
      console.log("Necesitas estar en una carpeta de proyecto (package.json)")
    }
  })

app.parse(process.argv)
process.exit(0)
