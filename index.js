const path = require('path');
const fs = require('fs-extra');
var multistream = require('multistream');
const Readable = require('stream').Readable;
const injectHTML = require("node-inject-html").default;
var crypto = require('crypto');

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

getPages('pages');

const header = fs.readFileSync('layout/header.html', {encoding: 'utf8'});
const footer = fs.readFileSync('layout/footer.html', {encoding: 'utf8'});

function renderHTML(file, newFile) {
    // return new Promise(resolve => {
    //     console.log('writing: ' + newFile);
        // var output = fs.createWriteStream(newFile);
    let html = fs.readFileSync(file, {encoding: 'utf8'});

        const content = injectHTML(html,  {
            bodyStart: header,
            bodyEnd: footer,
            headEnd: styleLinks.join('')
        });

    // if (!html.contains(/<header[^>]*>/)) {
    //     html = html.replace(/<body[^>]*>/)
    // }

        fs.outputFileSync(newFile, content);
        // const ms = new multistream([
        //     Readable.from(header),
        //     fs.createReadStream(file),
        //     Readable.from(footer)
        // ]);
        // ms.pipe(output);
        // ms.on('end', () => {
        //     resolve();
        // });
    // });
}

fileList.forEach(file => {
    const newPath = file.replace(/^pages/, 'dist');
    if (file.endsWith('.html')) {
       renderHTML(file, newPath);
    } else {
       fs.copySync(file, newPath);
    }
});