const cfg = require('./config');
const sqlite3 = require('better-sqlite3');
const oracledb = require('oracledb');

function getDocs(p_cadn, db) {
    db || (db = sqlite3(cfg.sqlite3db.dbPath));
    return new Promise(function(resolve, reject ) {
            const stmt = db.prepare('SELECT * FROM SCAN_DOCUMENTS WHERE cad_number = ?');
            const docs = stmt.all(p_cadn);
            resolve(docs);
    })/*.catch(err => {
        console.log( err.message)
    })*/
};
async function getOraScanDocsList(p_cadn, numRows = cfg.numRowsOraFetch) {
    let connection;
    try {
        let  result;
        connection = await oracledb.getConnection(cfg.oracleConnectionProperties);
        result = await connection.execute(
            `BEGIN scan_get_scanned_docs(:p_doc_list, :p_cad); END;`,
            { p_cad:  p_cadn, p_doc_list: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }},
            { outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
                // extendedMetaData: true,               // get extra metadata
                // prefetchRows:     100,                // internal buffer allocation size for tuning
                // fetchArraySize:   100                 // internal buffer allocation size for tuning
            }
        );

        // Fetch rows from the REF CURSOR.
        // If getRows(numRows) returns:
        //   Zero rows               => there were no rows, or are no more rows to return
        //   Fewer than numRows rows => this was the last set of rows to get
        //   Exactly numRows rows    => there may be more rows to fetch

        const resultSet = result.outBinds.p_doc_list;

        let rows = await resultSet.getRows(numRows); // get numRows rows at a time
        if (rows.length === numRows) {
            throw new Error("getRows(): Got " + rows.length + " rows. Possibly more than "+numRows+" documents");
        }

        // always close the ResultSet
        await resultSet.close();

        return rows;

    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

//todo shortDocName
function shortDocName(fullNameDoc,nameDoc,nameSize= cfg.shortDocNameLenght) {
    let result = "";
    if (fullNameDoc.length > nameSize) {
        let rightTrim = fullNameDoc.length - nameSize;
        let indexOfSubstring = fullNameDoc.indexOf(nameDoc);
        if (indexOfSubstring >= 0) {
            result = nameDoc.substring(0, nameDoc.length - rightTrim) + "... " +  fullNameDoc.substring(nameDoc.length )
        } else {
            result = fullNameDoc.substring(0, nameSize)
        }
    } else {
        result = fullNameDoc;
    }
    return result;
}

function createDocsTree(docs, multiDocsInSidebar = cfg.multiDocsInSidebar) {
    const Tree = require('../lib/treeClass');
    const docsTree = new Tree;
    if (docs.length === 0) {
        docsTree.error = 'the object not found';
    } else {
        docs.forEach(el => {
            docsTree._addNode('arrayDocsTree');
            let objId = ['cn', el.cad_number].join('_');
            let tomId  = ['tom', el.vol_nmb, objId].join('_');
            let docId  = ['doc', el.vol_nmb,el.ordr, tomId].join('_');
            let objData =  {cadn: el.cad_number, invn: el.inv_nomer, adr: el.adr_txt};
            let shortNameDoc = shortDocName(el.full_name_doc, el.name_doc);
            let docData = {fullName: el.full_name_doc, createUser: el.create_user, createAt: el.created_at, updateAt: el.updated_at, addInfo: el.add_info};
            let fileImg = el.file_img;
            docsTree.multiObjectsDocs = multiDocsInSidebar;
            if (multiDocsInSidebar) {
                docsTree._addNode(objId, el.cad_number,'icon-folder','arrayDocsTree', objData);
                docsTree._addNode(tomId, 'Vol ' + el.vol_nmb,'icon-folder', objId);
                docsTree._addNode(docId, shortNameDoc,'icon-page', tomId, docData, fileImg);
            } else {
                docsTree._addNode(tomId, 'Vol ' + el.vol_nmb,'icon-folder', 'arrayDocsTree', objData);
                docsTree._addNode(docId, shortNameDoc,'icon-page', tomId, docData, fileImg);
            }
        })
    }
    return docsTree;
}

function getDocsTree(p_cadn, db) {
    return getDocs(p_cadn, db)
        .then(docs => {
            return createDocsTree(docs)
        })
}

async function getOracleDocsTree(p_cadn, numRows) {
    let docs = await getOraScanDocsList(p_cadn, numRows);
    let tree = createDocsTree(docs);
    return tree;
}

module.exports.getDocsTree = getDocsTree;
module.exports.getDocs = getDocs;
module.exports.createDocsTree = createDocsTree;
module.exports.getOraScanDocsList = getOraScanDocsList;
module.exports.getOracleDocsTree = getOracleDocsTree

