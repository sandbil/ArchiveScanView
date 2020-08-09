
function getDocs(p_cadn, db) {
    return new Promise(function(resolve, reject ) {
            //const db = require('better-sqlite3')(dbPath);
            const stmt = db.prepare('SELECT * FROM SCAN_DOCUMENTS WHERE cad_number = ?');
            const docs = stmt.all(p_cadn);
            resolve(docs);
    })/*.catch(err => {
        console.log( err.message)
    })*/
}

function shortDocName(fullNameDoc,nameDoc) {
    let result = "";
    if (fullNameDoc.Length > 160) {
        let rightTrim = fullNameDoc.Length - 160;
        let indexOfSubstring = fullNameDoc.IndexOf(nameDoc);
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
    if (docs.length === 0) {
        docsTree.error = 'the object not founded';
    } else {
        docs.forEach(el => {
            docsTree._addNode('arrayDocsTree');
            let cadnId = ['cn', el.cad_number].join('_');
            let tomId  = ['tom', el.vol_nmb, cadnId].join('_');
            let docId  = ['doc', el.vol_nmb,el.ordr, tomId].join('_');
            let objData =  {cadn: el.cad_number, invn: el.inv_nomer, adr: el.adr_txt};
            let shortNameDoc = shortDocName(el.full_name_doc, el.name_doc);
            let docData = {fullName: el.full_name_doc, createUser: el.create_user, createAt: el.created_at, updateAt: el.updated_at, addInfo: el.add_info}
            let fileImg = el.file_img;
            docsTree._addNode(cadnId, el.cad_number,'icon-folder','arrayDocsTree', objData);
            docsTree._addNode(tomId, 'Vol ' + el.vol_nmb,'icon-folder', cadnId);
            docsTree._addNode(docId, shortNameDoc,'icon-page', tomId, docData, fileImg);
        })
    }
    return docsTree;
}

function getDocsTree(p_cadn, db) {
    db || (db = require('better-sqlite3')('db/testData.db'));
    return getDocs(p_cadn, db)
        .then(docs => {return createDocsTree(docs)})
        .catch(err=>{
            return {error: err.message};
        });
}

module.exports.getDocsTree = getDocsTree;
module.exports.getDocs = getDocs;
module.exports.createDocsTree = createDocsTree;



