const assert = require('assert');
const puppeteer = require('puppeteer');
const should = require('chai').should();
let {testData,testTreeClass}  = require('./testData');

function setDBtestData(testData, dbMem) {
    return new Promise(function(resolve, reject ) {
        let db;
        if (dbMem) {
            db = require('better-sqlite3')(':memory:');
        } else {
            db = require('better-sqlite3')('db/testData.db');
        };

        let stmt1 = db.prepare('DROP TABLE IF EXISTS "SCAN_DOCUMENTS"');
        stmt1.run();
        let stmt2 = db.prepare(testData.createTable);
        stmt2.run();
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

describe('test  function', function() {

    it('test treeClass', async function() {
        const Tree = require('../lib/treeClass');
        const tree = new Tree;
        testData.data.forEach(el => {
            tree._addNode('arrayDocsTree');
            let cadnId = ['cn', el.cad_number].join('_');
            let tomId  = ['tom', el.vol_nmb, cadnId].join('_');
            let docId  = ['doc', el.vol_nmb,el.ordr, tomId].join('_');
            tree._addNode(cadnId, el.cad_number,'icon-folder','arrayDocsTree', 'objData');
            tree._addNode(tomId, 'Том ' + el.vol_nmb,'icon-folder', cadnId);
            tree._addNode(docId, el.full_name_doc, 'icon-page', tomId, 'docData', el.file_img);
        });
        let allItem = [];
        tree._traverse((node) => {
            allItem.push(node.id);
        });
        assert.deepStrictEqual(tree._root.nodes,testTreeClass);

        assert.deepStrictEqual(tree._displayLeafs('tom_1_cn_04-25'),[
            {"id": "doc_1_0_tom_1_cn_04-25",
             "text": "volume 1 inventory04-25",
             "img": "icon-page",
             "objData": "docData",
             "fileImg": "inventory.pdf",
             "nodes": []
            },
            {"id": "doc_1_1_tom_1_cn_04-25",
             "text": "certificate_1_04-25",
             "img": "icon-page",
             "objData": "docData",
             "fileImg": "certificate_1_at_05-03-2003.1.pdf",
             "nodes": []
            }
        ]);
        assert.deepStrictEqual(tree._search('doc__1_tom__cn_7504-36'),
            {"id": "doc__1_tom__cn_7504-36",
             "text": "certificate_1_7504-36",
             "img": "icon-page",
             "objData": "docData",
             "fileImg": "certificate_1_at_05-03-2003.1.pdf",
             "nodes": []
        });

        tree._removeNode('cn_105-34');
        tree._search("cn_105-34").should.equal("Not Found");
        allItem = [];
        tree._traverse((node) => {
            allItem.push(node.id);
        });
        assert.deepStrictEqual(allItem,[
            "arrayDocsTree",
              "cn_04-25",
                "tom_1_cn_04-25",
                  "doc_1_0_tom_1_cn_04-25",
                  "doc_1_1_tom_1_cn_04-25",
                "tom_2_cn_04-25",
                  "doc_2_0_tom_2_cn_04-25",
                  "doc_2_1_tom_2_cn_04-25",
              "cn_7504-36",
                "tom__cn_7504-36",
                  "doc__0_tom__cn_7504-36",
                  "doc__1_tom__cn_7504-36",
                "tom_1_cn_7504-36",
                  "doc_1_0_tom_1_cn_7504-36",
                  "doc_1_1_tom_1_cn_7504-36",
        ]);
    });

    it('test dbSqlite.getDocs function search cadn from SQLITE', async function() {
        var dbSqlite = require('../lib/dbSqlite');

        let db = await setDBtestData(testData, 1)
            .catch(err => {
                console.log(err);
                return ({error:err.message})
            });
        db.name.should.equal(":memory:");
        db.open.should.equal(true);

        res = await dbSqlite.getDocs('7504361',db); //return empty object
        assert.deepStrictEqual(res.error,undefined);
        assert.deepStrictEqual(res,[]);

        res = await dbSqlite.getDocs('105-34',db); //return some array object
        assert.deepStrictEqual(res.error,undefined);
        assert.deepStrictEqual(res, [testData.data[4],testData.data[5]]);
    });

    it('test dbSqlite.createDocsTree function ', async function() {
        let dbSqlite = require('../lib/dbSqlite');
        let tree = await dbSqlite.createDocsTree(testData.data);
        let allItem = [];
        tree._traverse((node) => {
            allItem.push({[node.id]:node.text, fileImg: node.fileImg});
        });
        assert.deepStrictEqual(allItem,[
            {"arrayDocsTree": undefined, "fileImg": undefined},
              {"cn_04-25": "04-25", "fileImg": undefined},
                {"tom_1_cn_04-25": "Том 1", "fileImg": undefined},
                  {"doc_1_0_tom_1_cn_04-25": "volume 1 inventory04-25", "fileImg": "inventory.pdf"},
                  {"doc_1_1_tom_1_cn_04-25": "certificate_1_04-25","fileImg": "certificate_1_at_05-03-2003.1.pdf"},
                {"tom_2_cn_04-25": "Том 2", "fileImg": undefined},
                  {"doc_2_0_tom_2_cn_04-25": "volume 2 inventory04-25","fileImg": "inventory.pdf"},
                  {"doc_2_1_tom_2_cn_04-25": "certificate_2_04-25","fileImg": "certificate_2_at_11-01-2006.5.pdf"},
              {"cn_105-34": "105-34", "fileImg": undefined},
                {"tom_1_cn_105-34": "Том 1","fileImg": undefined},
                  {"doc_1_0_tom_1_cn_105-34": "volume inventory105-34","fileImg": "inventory3.pdf"},
                  {"doc_1_1_tom_1_cn_105-34": "reference_at_105-34","fileImg": "reference_at_10-10-1998.1.pdf"},
              {"cn_7504-36": "7504-36","fileImg": undefined,},
                {"tom__cn_7504-36": "Том ","fileImg": undefined},
                  {"doc__0_tom__cn_7504-36": "volume inventory7504-36","fileImg": "inventory.pdf"},
                  {"doc__1_tom__cn_7504-36": "certificate_1_7504-36","fileImg": "certificate_1_at_05-03-2003.1.pdf"},
                {"tom_1_cn_7504-36": "Том 1", "fileImg": undefined},
                  {"doc_1_0_tom_1_cn_7504-36": "volume 1 inventory7504-36","fileImg": "inventory.pdf"},
                  {"doc_1_1_tom_1_cn_7504-36": "certificate_2_7504-36", "fileImg": "certificate_2_at_11-01-2006.5.pdf"}
        ]);
    });

    it('test getDocsTree function ', async function() {
        let dbSqlite = require('../lib/dbSqlite');
        let db = await setDBtestData(testData, 1)
            .catch(err => {
                console.log(err);
                return ({error:err.message})
            });
        let resEmpty = await dbSqlite.getDocsTree('09300',db);
        resEmpty.error.should.to.be.equal('the object not founded');

        let res = await dbSqlite.getDocsTree('105-34',db);
        assert.deepStrictEqual(res.error, undefined);
        res._traverse((node) => {
            console.log(node.id,node.text);
        });
        assert.deepStrictEqual(res._search('doc_1_0_tom_1_cn_105-34'),
            {
             "id": "doc_1_0_tom_1_cn_105-34",
             "text": "volume inventory105-34",
             "img": "icon-page",
             "objData": {
                    "addInfo": "need recheck",
                    "createAt": "08/30/2019 16:40:01",
                    "createUser": "somebody",
                    "fullName": "volume inventory105-34",
                    "updateAt": "10/05/2019 16:40:01",
             },
             "fileImg": "inventory3.pdf",
             "nodes": []
            }
        );
    })
});
describe('test  Interface', function() {
    let browser;
    let page;
    let page1;
    let server;
    let editAllToolBarArray;
    // puppeteer options
    const opts = {
        headless: false,
        defaultViewport: null,
        args : ['--window-size=1350,800', '--lang=en-GB' ],
        devtools: true,
        //slowMo: 100,
        timeout: 10000
    };

    before(async function() {
        this.timeout(10000);
        await setDBtestData(testData);
        const app = require('../app');
        //app.use(app.static('test'));
        server = await app.listen(3000);

        // Launch Puppeteer and navigate to the Express server
        browser = await puppeteer.launch(opts);
        page = await browser.newPage();
        await page.goto('http://localhost:3000/');
        await page.waitForSelector('#main');
    });

    after (async function(){
        //await browser.close();
        //await server.close();
    });

    describe('test ', function() {

        beforeEach(async function () {
            await page.evaluate(() => {
               // let spreadsheet = null; //destroy previous spreadsheet
            });
            await page.waitForSelector('#fldSearch');
        });
        function responseParse(url) {
            let request = require("request");
            return new Promise(function(resolve, reject) {
                request({url : url},
                    function (error, response, body) {
                        if (error) {
                            console.log('Couldn’t get page because of error: ' + error);
                            reject(error);
                            return;
                        } else if (response.statusCode !== 200) {
                            let err = new Error('Response error');
                            err.message = response.statusCode + ' ' + body;
                            console.log('Couldn’t get page because of response error: ' + err);
                            reject(err);
                            return;
                        }
                        resolve(body);
                    });
            });
        }

        it('test get get docsTree', async function() {
            this.timeout(10000);
            let result = await responseParse('http://localhost:3000/docstree?cadn=04-25');
            console.log(result)
        });
        it('test search cadn', async function() {
            this.timeout(10000);
            await page.click('#fldSearch');
            await page.type('#fldSearch','75:32:040508:2559');
            //await page.keyboard.press('Enter');
            await page.waitFor(500);
            //let tabeditCells = await page.evaluate(() => { return SocialCalc.GetSpreadsheetControlObject().editor.context.sheetobj.cells});
            //tabeditCells.A3.coord.should.to.be.equal('A3')

        });


    });

});

