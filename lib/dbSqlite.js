function getDocs(p_cadn, dbPath) {
    return new Promise(function(resolve, reject ) {
            const db = require('better-sqlite3')(dbPath);
            const stmt = db.prepare('SELECT * FROM SCAN_DOCUMENTS WHERE cad_number = ?');
            const docs = stmt.all(p_cadn);
            resolve(docs);
    })/*.catch(err => {
        console.log( err.message)
    })*/
};

function shortDocName(fullNameDoc,nameDoc) {
    var result = "";
    if (fullNameDoc.Length > 160) {
        var rightTrim = fullNameDoc.Length - 160;
        var indexOfSubstring = fullNameDoc.IndexOf(nameDoc);
        if (indexOfSubstring >= 0) {
            result = nameDoc.Substring(0, nameDoc.Length - rightTrim) + "... " +  fullNameDoc.Substring(nameDoc.Length )
        } else {
            result = fullNameDoc.Substring(0, 160)
        }
    } else {
        result = fullNameDoc;
    }
    return result;
}

function createDocsTree(docs) {
    const Tree = require('../lib/treeClass')
    const docsTree = new Tree;
    if (docs.length == 0) {
        docsTree.error = 'the object not founded';
    } else {
        docs.forEach(el => {
            var objData =  {cadn: el.cad_number, invn: el.INV_NOMER, adr: el.ADR_TXT};
            docsTree._addNode('cadn', el.cad_number,'icon-folder',null, objData);
            docsTree._addNode('tom'+ el.VOL_NMB, 'Том ' + el.VOL_NMB,'icon-folder', 'cadn');
            var shortNameDoc = shortDocName(el.full_name_doc, el.name_doc);
            var docData = {fullName: el.FULL_NAME_DOC, createUser: el.CREATE_USER, createAt: el.CREATED_AT, updateAt: el.UPDATED_AT, addInfo: el.ADD_INFO}
            var fileImg = el.file_img;
            docsTree._addNode('doc_'+ el.VOL_NMB + '_' + el.ORDR, shortNameDoc,'icon-page', 'tom'+ el.VOL_NMB, docData, fileImg);
        })
    }
    return docsTree;
}

function getDocsTree(p_cadn, dbPath) {
    dbPath || (dbPath='db/testData.db');
    return getDocs(p_cadn, dbPath)
        .then(docs => {return createDocsTree(docs)})
        .catch(err=>{
            return {error: err.message};
        });
}

module.exports.getDocsTree = getDocsTree;
module.exports.getDocs = getDocs;
module.exports.createDocsTree = createDocsTree;


