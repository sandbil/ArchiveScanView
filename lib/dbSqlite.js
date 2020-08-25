const cfg = require('./config');
const sqlite3 = require('better-sqlite3');
const oraDB = require('oracledb');

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
async function getOraScanDocsList(p_cadn) {
    let connection;
    const numRows = 500;
    try {
        let  result;
        connection = await oracledb.getConnection(dbConfig);

        result = await connection.execute(
            `BEGIN
                scan_get_scanned_docs(:p_doc_list, :p_cad);
             END;`,
            {
                p_cad:  p_cadn  ,
                p_doc_list: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
            },
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT,   // query result format
                // extendedMetaData: true,               // get extra metadata
                // prefetchRows:     100,                // internal buffer allocation size for tuning
                // fetchArraySize:   100                 // internal buffer allocation size for tuning
            }
        );

        console.log("Cursor metadata:");
        console.log(result.outBinds.cursor.metaData);

        //
        // Fetch rows from the REF CURSOR.
        //
        //
        // If getRows(numRows) returns:
        //   Zero rows               => there were no rows, or are no more rows to return
        //   Fewer than numRows rows => this was the last set of rows to get
        //   Exactly numRows rows    => there may be more rows to fetch

        const resultSet = result.outBinds.cursor;
        let rows;
        do {
            rows = await resultSet.getRows(numRows); // get numRows rows at a time
            if (rows.length > 0) {
                console.log("getRows(): Got " + rows.length + " rows");
                console.log(rows);
            }
        } while (rows.length === numRows);

        // always close the ResultSet
        await resultSet.close();

    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
};

function getOraDocsList(p_cadn, numRows=500) {
    return new Promise(function(resolve, reject) {
        let conn; // Declared here for scoping purposes
        oracledb.getConnection(config.connectionProperties)
            .then(function (conn) {
                //:p_docs_list,  :p_cadn
                var bindvars = {
                    p_docs_list: {type: oracledb.CURSOR, dir: oracledb.BIND_OUT},
                    p_cadn: p_cadn
                };
                return conn.execute(sqlTxt.inv_nmb, bindvars, { outFormat: oracledb.OBJECT })
                    .then(function (result) {
                        var resultSet = result.outBinds.p_docs_list;
                        return resultSet.getRows(numRows)
                    })
                    .then(function (rows) {
                        if (conn)  conn.close();
                        console.log('запрос sqlTxt.inv_nmb выполнился');
                        resolve(rows);
                    })
            }, function (err) {
                console.log('Ошибка соединения', err);
                reject(err);
            });
    })
};

//todo shortDocName
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
    const Tree = require('../lib/treeClass');
    const docsTree = new Tree;
    if (docs.length === 0) {
        docsTree.error = 'the object not found';
    } else {
        docs.forEach(el => {
            docsTree._addNode('arrayDocsTree');
            let cadnId = ['cn', el.cad_number].join('_');
            let tomId  = ['tom', el.vol_nmb, cadnId].join('_');
            let docId  = ['doc', el.vol_nmb,el.ordr, tomId].join('_');
            let objData =  {cadn: el.cad_number, invn: el.inv_nomer, adr: el.adr_txt};
            let shortNameDoc = shortDocName(el.full_name_doc, el.name_doc);
            let docData = {fullName: el.full_name_doc, createUser: el.create_user, createAt: el.created_at, updateAt: el.updated_at, addInfo: el.add_info};
            let fileImg = el.file_img;
            docsTree._addNode(cadnId, el.cad_number,'icon-folder','arrayDocsTree', objData, );
            docsTree._addNode(tomId, 'Vol ' + el.vol_nmb,'icon-folder', cadnId);
            docsTree._addNode(docId, shortNameDoc,'icon-page', tomId, docData, fileImg);
        })
    }
    return docsTree;
}

function getDocsTree(p_cadn, db) {
    return getDocs(p_cadn, db)
        .then(docs => {return createDocsTree(docs)})
        /*.catch(err=>{
            return {error: err};
        });*/
}

module.exports.getDocsTree = getDocsTree;
module.exports.getDocs = getDocs;
module.exports.createDocsTree = createDocsTree;
module.exports.getOraScanDocsList = getOraScanDocsList;


