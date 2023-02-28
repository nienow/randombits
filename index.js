const fs = require('fs-extra');
const injectHTML = require("node-inject-html").default;
const crypto = require('crypto');

function writeCommonCss(name) {
    const content = fs.readFileSync(`styles/${name}`, {encoding: 'utf8'});
    const hash = crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
    fs.outputFileSync(`dist/_layout/${hash}.${name}`, content);
    return `<link rel="stylesheet" href="/_layout/${hash}.${name}" />`;
}

const styleLinks = fs.readdirSync('styles').map(name => writeCommonCss(name));


const fileList = [];
function getPages(dir) {
    const entries = fs.readdirSync(dir, {withFileTypes: true});
    entries.forEach(entry => {
        const item = `${dir}/${entry.name}`;
        if (entry.isDirectory()) {
            getPages(item);
        } else {
            fileList.push(item);
        }
    });
}

getPages('content');

const header = fs.readFileSync('layout/header.html', {encoding: 'utf8'});
const footer = fs.readFileSync('layout/footer.html', {encoding: 'utf8'});

function renderHTML(file, newFile) {
    let html = fs.readFileSync(file, {encoding: 'utf8'});
    const content = injectHTML(html,  {
        bodyStart: header,
        bodyEnd: footer,
        headEnd: styleLinks.join('')
    });
    fs.outputFileSync(newFile, content);
}

fileList.forEach(file => {
    const newPath = file.replace(/^pages/, 'dist');
    if (file.endsWith('.html')) {
       renderHTML(file, newPath);
    } else {
       fs.copySync(file, newPath);
    }
});