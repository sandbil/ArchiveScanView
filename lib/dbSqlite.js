function setDBtestData(testData) {
    return new Promise(function(resolve, reject ) {
        const db = require('better-sqlite3')(':memory:');
        const stmt = db.prepare('CREATE TABLE "SCAN_DOCUMENTS" (' +
            '"id" NUMBER NOT NULL,' +
            '"inv_nomer" VARCHAR2(250),' +
            '"cad_number" VARCHAR2(100),' +
            '"cond_number" VARCHAR2(100),' +
            '"adr_txt" VARCHAR2(4000),' +
            '"name_doc" VARCHAR2(1000),' +
            '"full_name_doc" VARCHAR2(4000),' +
            '"ver" NUMBER(5) NOT NULL DEFAULT 1,' +
            '"file_img" VARCHAR2(4000),' +
            '"create_user" VARCHAR2(100),' +
            '"created_at" DATE NOT NULL DEFAULT SYSDATE,' +
            '"updated_at" DATE,' +
            '"add_info" VARCHAR2(250),' +
            '"VOL_NMB" VARCHAR2(20),' +
            '"ORDR" NUMERIC' +
            ')');
        stmt.run();
        const insert = db.prepare('INSERT INTO "SCAN_DOCUMENTS" (' + testData.fields + ') VALUES (' + testData.bindPrm + ')');

        const insertMany = db.transaction((records) => {
            for (const rec of records) insert.run(rec);
        });
        insertMany(testData.data);

        resolve(db);
    })/*.catch(err => {
        console.log( err.message)
    })*/
}

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
    if (docs.length === 0) {
        docsTree.error = 'the object not founded';
    } else {
        docs.forEach(el => {
            docsTree._addNode('arrayDocsTree');
            var objData =  {cadn: el.cad_number, invn: el.inv_nomer, adr: el.adr_txt};
            docsTree._addNode('cadn'+el.cad_number, el.cad_number,'icon-folder','arrayDocsTree', objData);
            docsTree._addNode('tom'+ el.vol_nmb, 'Том ' + el.vol_nmb,'icon-folder', 'cadn'+el.cad_number);
            var shortNameDoc = shortDocName(el.full_name_doc, el.name_doc);
            var docData = {fullName: el.full_name_doc, createUser: el.create_user, createAt: el.create_at, updateAt: el.update_at, addInfo: el.add_info}
            var fileImg = el.file_img;
            docsTree._addNode('doc_'+ el.vol_nmb + '_' + el.ordr, shortNameDoc,'icon-page', 'tom'+ el.vol_nmb, docData, fileImg);
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
module.exports.setDBtestData = setDBtestData;


