import { Stylable, createMinimalFS } from '@stylable/core';
import css from 'raw-loader!codemirror/lib/codemirror.css';
const CodeMirror = require('codemirror/lib/codemirror');

async function main() {
    const pcase = await loadCase('xxx');
    console.log(pcase);
    const files = {};

    const { fs, requireModule } = createMinimalFS({ files });

    const stylable = Stylable.create({
        fileSystem: fs,
        requireModule: requireModule,
        resolveNamespace: ns => ns,
        projectRoot: '/'
    });

    initEditors(stylable);
}

main();

function initEditors(stylable: Stylable) {
    addCSS(css);

    const input = CodeMirror.fromTextArea(document.getElementById('input'), {
        lineNumbers: true,
        mode: 'css'
    });

    const output = CodeMirror.fromTextArea(document.getElementById('output'), {
        lineNumbers: true,
        mode: 'css'
    });

    input.on('change', () => {
        const code: string = input.getValue();
        const res = stylable.transform(code, 'entry.css');
        output.setValue(res.meta.outputAst!.toString());
    });
}

function addCSS(css: any) {
    const s = document.createElement('style');
    s.textContent = css;
    document.head.prepend(s);
}

function loadCase(caseID: string) {
    return fetch(`http://localhost:3000/cases/${caseID}`).then(res => res.json());
}

function saveCase(caseID: string, data: object) {
    return fetch(`http://localhost:3000/cases/${caseID}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => {
        console.log('Request complete! response:', res);
    });
}
