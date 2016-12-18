import fs from 'fs';
import path from 'path';
import mkpath from 'mkpath'

let option;
let basePath = path.resolve('.');
let outputPath
let filesPath
const filesSubPath = "files/"
let classesPath
const classesSubPath = "classes/"
let data = {
  files: {},
  classes: {},
  constructors : {},
  members : {},
  methods : {},
  functions: {},
  variables: {},
  sets: {},
  gets: {},
  externals: {},
  test_ref: {},
  test_file: {},
  test_describe: {},
  test_it: {},
}
let unprocessKind = []

/**
 * take option
 * @param {Object} ev - handle event.
 */
export function onStart(ev) {
  option = ev.data.option;
  if (option) {
    outputPath = option.output || "rst-doc"
  }
  outputPath = basePath + "/" + outputPath + "/"
  filesPath = outputPath + filesSubPath
  classesPath = outputPath + classesSubPath
  console.log(`RST Documentation will be generated in ${outputPath}`)
  mkpath.sync(outputPath)
  mkpath.sync(filesPath)
}

export function onHandleConfig(ev) {
  // console.warn(ev.data.config.access)
}

export function onHandleTag(ev) {
  for (let tag of ev.data.tag) {
    switch(tag.kind) {
      case "file":
        processFile(tag)
        break
      case "class":
        processClass(tag)
        break
      case "constructor":
        processConstructor(tag)
        break
      case "member":
        processMember(tag)
        break
      case "method":
        processMethod(tag)
        break
      case "function":
        processFunction(tag)
        break
      case "variable":
        processVariable(tag)
        break
      case "set":
        processSet(tag)
        break
      case "get":
        processGet(tag)
        break
      case "external":
        processExternal(tag)
        break
      case "testFile":
        processTestFile(tag)
        break
      case "testDescribe":
        processTestDescribe(tag)
        break
      case "testIt":
        processTestIt(tag)
        break
      default:
        defaultCase(tag)
    }
  }
  generateFiles()
}

function defaultCase(tag) {
  if (unprocessKind.indexOf(tag.kind) === -1) {
    console.warn(`Tag type : ${tag.kind} is not processed !`)
    console.log("Example :")
    console.log(tag)
    unprocessKind.push(tag.kind)
  }
}

function processFile(tag) {
  const newFile = {}
  newFile.tag = tag
  newFile.functions = []
  newFile.variables = []
  newFile.classes = []
  data.files[tag.longname] = newFile
}

function processClass(tag) {
  const newClass = {}
  newClass.tag = tag
  newClass.constructor = null
  newClass.members = []
  newClass.methods = []
  newClass.gets = []
  newClass.sets = []
  data.files[tag.memberof].classes.push(newClass)
  data.classes[tag.longname] = newClass
}

function processConstructor(tag) {
  const newConstructor = {}
  newConstructor.tag = tag
  data.constructors[tag.longname] = newConstructor
  data.classes[tag.memberof].constructor = newConstructor
}

function processMember(tag) {
  const newMember = {}
  newMember.tag = tag
  data.members[tag.longname] = newMember
  data.classes[tag.memberof].members.push(newMember)
}

function processMethod(tag) {
  const newMethod = {}
  newMethod.tag = tag
  data.methods[tag.longname] = newMethod
  data.classes[tag.memberof].methods.push(newMethod)
}

function processFunction(tag) {
  const newFunction = {}
  newFunction.tag = tag
  data.functions[tag.longname] = newFunction
  data.files[tag.memberof].functions.push(newFunction)
}

function processVariable(tag) {
  const newVariable = {}
  newVariable.tag = tag
  data.variables[tag.longname] = newVariable
  data.files[tag.memberof].variables.push(newVariable)
}

function processGet(tag) {
  const newGet = {}
  newGet.tag = tag
  data.gets[tag.longname] = newGet
  data.classes[tag.memberof].gets.push(newGet)
}

function processSet(tag) {
  const newSet = {}
  newSet.tag = tag
  data.sets[tag.longname] = newSet
  data.classes[tag.memberof].sets.push(newSet)
}

function processTestFile(tag) {
  const newTestFile = {}
  newTestFile.tag = tag
  newTestFile.describes = []
  data.test_file[tag.longname] = newTestFile
  data.test_ref[tag.longname] = newTestFile
}

function processTestDescribe(tag) {
  const newTestDescribe = {}
  newTestDescribe.tag = tag
  newTestDescribe.describes = []
  newTestDescribe.its = []
  data.test_describe[tag.longname] = newTestDescribe
  data.test_ref[tag.longname] = newTestDescribe
  data.test_ref[tag.memberof].describes.push(newTestDescribe)
}

function processTestIt(tag) {
  const newTestIt = {}
  newTestIt.tag = tag
  data.test_it[tag.longname] = newTestIt
  data.test_ref[tag.longname] = newTestIt
  data.test_describe[tag.memberof].its.push(newTestIt)
}

function processExternal(tag) {
  const newExternal = {}
  newExternal.tag = tag
  data.externals[tag.name] = newExternal
}

function generateJSON() {
  fs.writeFileSync("datas.json", JSON.stringify(data, null, 2), {flag: "w+"})
}

function generateFiles() {
  for (const f of Object.keys(data.files)) {
    generateFile(data.files[f])
  }
  for (const c of Object.keys(data.classes)) {
    generateClassFile(data.classes[c])
  }

}

function _generateTitle(title, lvl=0) {
  const levels = ['=', '-', '=', '-', '`', '\'', '.', '~', '*', '+', '^']
  let titleFormat = ""
  if (lvl < 2) {
    titleFormat += Array(title.length + 1).join(levels[lvl]) + "\n"
  }
  titleFormat += title + "\n"
  titleFormat += Array(title.length + 1).join(levels[lvl]) + "\n\n"
  return titleFormat
}

function generateFile(file) {
  const tag = file.tag
  let content = _generateTitle(tag.name, 0)

  content += ".. codeblock:: javascript\n\n"

  content += "   " + tag.content.replace(/\n/g, "\n   ")

  const fileName = tag.longname.replace(/\.js$/, ".rst")
  const filePath = filePath + fileName
  mkpath.sync(path.dirname(filePath))
  fs.writeFileSync(filePath, content, {flag: "w+"})
  console.warn(filesSubPath + fileName)
}


function generateClassFile(classe) {
  const tag = classe.tag
  let content = `import ${tag.importStyle} from "${tag.importPath}"\n`
  content += `${tag.access ? tag.access : "public"} class\n\n`

  content += _generateTitle(tag.name)
  content += generateClassFileSummary(classe)

  const fileName = tag.longname + ".rst"
  const filePath = classesPath + fileName
  mkpath.sync(path.dirname(filePath))
  fs.writeFileSync(filePath, content, {flag: "w+"})
  console.warn(classesSubPath + fileName)
}

function generateClassFileSummary(classe) {
  classe.methods.sort((a, b) => { return (a.tag.name < b.tag.name) ? -1 : (a.tag.name > b.tag.name) ? 1 : 0 })
  let content = ""
  content += generateClassSummary("Static Method Summary", classe.methods.filter((e) => e.tag.static).map((e) => e.tag))
  if (classe.constructor) {
    content += generateClassSummary("Constructor Summary", [classe.constructor.tag])
  }
  content += generateClassSummary("Member Summary", classe.members.map((e) => e.tag))
  content += generateClassSummary("Methods Summary", classe.methods.filter((e) => !e.tag.static).map((e) => e.tag))
  return content
}

function _generateTypes(types) {
  if (types) {
    return types.join(" | ")
  }
  return ""
}

function _generateArguments(tag) {
  let content = "("
  const params = []
  for (const param of tag.params) {
    params.push(`${param.name}: ${_generateTypes(param.types)}`)
  }
  if (params.length) {
    content += params.join(", ")
  }
  content += ")"
  if (tag.return && tag.return.types) {
    content += `: ${_generateTypes(tag.return.types)}`
  }
  return content
}

function generateClassSummary(name, tags) {
  if (!tags.length) {
    return ""
  }

  let content = `.. rubric:: ${name}\n\n`
  for (const tag of tags) {
    switch(tag.kind) {
      case "method":
      case "constructor":
        content += `*    ${tag.name + _generateArguments(tag)}\n`
      break
      case "member":
        content += `*    ${tag.name}: ${_generateTypes(tag.type.types)}\n`
    }
  }

  return content + '\n'
}
