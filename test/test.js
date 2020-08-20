//const assert = require('assert');
const cfg = require('../lib/config')
const puppeteer = require('puppeteer');
const expect = require('chai').expect;
let {testData,testTreeClass, treeTest}  = require('./testData');

function setDBtestData(testData, dbMem) {
    return new Promise(function(resolve, reject ) {
        let db;
        if (dbMem) {
            db = require('better-sqlite3')(':memory:');
        } else {
            db = require('better-sqlite3')([cfg.sqlite3db.dir,'/',cfg.sqlite3db.filename].join(''));
        }
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
            tree._addNode(tomId, 'Vol ' + el.vol_nmb,'icon-folder', cadnId);
            tree._addNode(docId, el.full_name_doc, 'icon-page', tomId, 'docData', el.file_img);
        });
        let allItem = [];
        tree._traverse((node) => {
            allItem.push(node.id);
        });
        expect(tree._root.nodes,).to.deep.equal(testTreeClass);

        expect(tree._displayLeafs('tom_1_cn_04-25')).to.deep.equal([
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
        expect(tree._search('doc__1_tom__cn_7504-36')).to.deep.equal(
            {"id": "doc__1_tom__cn_7504-36",
             "text": "certificate_1_7504-36",
             "img": "icon-page",
             "objData": "docData",
             "fileImg": "certificate_1_at_05-03-2003.1.pdf",
             "nodes": []
        });

        tree._removeNode('cn_105-34');
        expect(tree._search("cn_105-34")).to.equal("Not Found");
        allItem = [];
        tree._traverse((node) => {
            allItem.push(node.id);
        });
        expect(allItem).to.deep.equal([
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
        expect(db.name).to.equal(":memory:");
        expect(db.open).to.equal(true);

        res = await dbSqlite.getDocs('7504361',db); //return empty object
        expect(res.error).to.deep.equal(undefined);
        expect(res).to.deep.equal([]);

        res = await dbSqlite.getDocs('105-34',db); //return some array object
        expect(res.error).to.deep.equal(undefined);
        expect(res).to.deep.equal( [testData.data[4],testData.data[5]]);
        expect(res[0]).to.have.property('cad_number');
        expect(res[0]).to.have.property('inv_nomer');
        expect(res[0]).to.have.property('adr_txt');
        expect(res[0]).to.have.property('full_name_doc');
        expect(res[0]).to.have.property('name_doc');
        expect(res[0]).to.have.property('create_user');
        expect(res[0]).to.have.property('created_at');
        expect(res[0]).to.have.property('updated_at');
        expect(res[0]).to.have.property('add_info');
        expect(res[0]).to.have.property('file_img');
        expect(res[0]).to.have.property('vol_nmb');
        expect(res[0]).to.have.property('ordr');


    });

    it('test dbSqlite.createDocsTree function ', async function() {
        let dbSqlite = require('../lib/dbSqlite');
        let tree = await dbSqlite.createDocsTree(testData.data);
        let allItem = [];
        tree._traverse((node) => {
            allItem.push({[node.id]:node.text, fileImg: node.fileImg});
        });
        expect(allItem).to.deep.equal([
            {"arrayDocsTree": undefined, "fileImg": undefined},
              {"cn_04-25": "04-25", "fileImg": undefined},
                {"tom_1_cn_04-25": "Vol 1", "fileImg": undefined},
                  {"doc_1_0_tom_1_cn_04-25": "volume 1 inventory04-25", "fileImg": "inventory.pdf"},
                  {"doc_1_1_tom_1_cn_04-25": "certificate_1_04-25","fileImg": "certificate_1_at_05-03-2003.1.pdf"},
                {"tom_2_cn_04-25": "Vol 2", "fileImg": undefined},
                  {"doc_2_0_tom_2_cn_04-25": "volume 2 inventory04-25","fileImg": "inventory2.pdf"},
                  {"doc_2_1_tom_2_cn_04-25": "certificate_2_04-25","fileImg": "certificate_2_at_11-01-2006.5.pdf"},
              {"cn_105-34": "105-34", "fileImg": undefined},
                {"tom_1_cn_105-34": "Vol 1","fileImg": undefined},
                  {"doc_1_0_tom_1_cn_105-34": "volume inventory105-34","fileImg": "inventory3.pdf"},
                  {"doc_1_1_tom_1_cn_105-34": "reference_at_105-34","fileImg": "reference_at_10-10-1998.1.pdf"},
              {"cn_7504-36": "7504-36","fileImg": undefined,},
                {"tom__cn_7504-36": "Vol ","fileImg": undefined},
                  {"doc__0_tom__cn_7504-36": "volume inventory7504-36","fileImg": "inventory4.pdf"},
                  {"doc__1_tom__cn_7504-36": "certificate_1_7504-36","fileImg": "certificate_1_at_05-03-2003.1.pdf"},
                {"tom_1_cn_7504-36": "Vol 1", "fileImg": undefined},
                  {"doc_1_0_tom_1_cn_7504-36": "volume 1 inventory7504-36","fileImg": "inventory5.pdf"},
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
        expect(resEmpty.error).to.equal('the object not founded');

        let res = await dbSqlite.getDocsTree('105-34',db);
        expect(res.error).to.deep.equal( undefined);
        res._traverse((node) => {
            console.log(node.id,node.text);
        });
        expect(res._search('doc_1_0_tom_1_cn_105-34')).to.deep.equal(
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
                        resolve(response);
                    });
            });
        }

        it('test get get docsTree', async function() {
            this.timeout(10000);
            let result = await responseParse('http://localhost:3000/docstree?cadn=04-25');
            expect(result).to.have.property('statusCode', 200);
            expect(result).to.have.property('headers');
            expect(result.headers).to.have.property('content-type', 'application/json; charset=utf-8');
            expect(JSON.parse(result.body)).to.deep.equal(treeTest);

            result = await responseParse('http://localhost:3000/docstree?cadn=04-251');
            expect(result).to.have.property('statusCode', 200);
            expect(result).to.have.property('headers');
            expect(result.headers).to.have.property('content-type', 'application/json; charset=utf-8');
            expect(JSON.parse(result.body)).to.deep.equal({"_root": null, "error": "the object not founded"});
        });

        it('test get get docs file', async function() {
            this.timeout(10000);
            let result = await responseParse('http://localhost:3000/getdoc?filepdf=inventory.pdf');
            //console.log(result);
            expect(result).to.have.property('statusCode', 200);
            expect(result).to.have.property('headers');
            expect(result.headers).to.have.property('content-type', 'application/pdf');
            expect(result.headers).to.have.property('content-length', '42361');

            result = await responseParse('http://localhost:3000/getdoc?filepdf=sample1.pdf');
            //console.log(result);
            expect(result).to.have.property('statusCode', 200);
            expect(result).to.have.property('headers');
            expect(result.headers).to.have.property('content-type', 'text/html; charset=utf-8');
            expect(result.body).to.equal("error");
        });

        it('test search cadn', async function() {
            this.timeout(10000);
            await page.click('#fldSearch');
            await page.type('#fldSearch','04-25');
            await page.keyboard.press('Enter');
            await page.waitForSelector("#node_cn_04-25");
            let nodeId = await page.evaluate(() => {
                return [
                $("#node_cn_04-25 div.w2ui-node-caption").text(),
                  $("#node_tom_1_cn_04-25 div.w2ui-node-caption").text(),
                    $("#node_doc_1_0_tom_1_cn_04-25 div.w2ui-node-caption").text(),
                    $("#node_doc_1_1_tom_1_cn_04-25 div.w2ui-node-caption").text(),
                  $("#node_tom_2_cn_04-25 div.w2ui-node-caption").text(),
                    $("#node_doc_2_0_tom_2_cn_04-25 div.w2ui-node-caption").text(),
                    $("#node_doc_2_1_tom_2_cn_04-25 div.w2ui-node-caption").text()
            ];
            });
            expect(nodeId).to.deep.equal([
                "04-25",
                "Vol 1",
                "volume 1 inventory04-25",
                "certificate_1_04-25",
                "Vol 2",
                "volume 2 inventory04-25",
                "certificate_2_04-25"
            ]);
        });

        it('test click doc in docstree', async function() {
            this.timeout(10000);
            this.timeout(10000);
            await page.click('#fldSearch',{clickCount: 3});
            await page.type('#fldSearch','04-25');
            await page.keyboard.press('Enter');
            await page.waitForSelector("#node_cn_04-25");

            let divForEmbedDoc = await page.evaluate(() => {
                return  $("#doc_1_0_tom_1_cn_04-25").length
            });
            expect(divForEmbedDoc).to.equal(0);
            await Promise.all([
                page.waitForSelector('#doc_1_0_tom_1_cn_04-25'),
                page.click('#node_doc_1_0_tom_1_cn_04-25', {clickCount:2}),
            ]);
            divForEmbedDoc = await page.evaluate(() => {
                return  $("#doc_1_0_tom_1_cn_04-25").length
            });
            expect(divForEmbedDoc).to.equal(1);
            divContent = await page.evaluate(() => {
                return  [$("#doc_1_0_tom_1_cn_04-25").children().prop('nodeName'),
                    $("#doc_1_0_tom_1_cn_04-25").children().attr('class'),
                    $("#doc_1_0_tom_1_cn_04-25").children().attr('src'),
                    $("#doc_1_0_tom_1_cn_04-25").children().attr('style')]
            });
            expect(divContent).to.deep.equal(["EMBED", "pdfobject",
                "/getdoc?filepdf=inventory.pdf#navpanes=0&toolbar=0&statusbar=0&view=FitH&pagemode=thumbs",
                "overflow: auto; width: 100%; height: 100%;"]);

            await page.click('.w2ui-tab-close');
            page.waitFor(100);
            divForEmbedDoc = await page.evaluate(() => {
                return  $("#doc_1_0_tom_1_cn_04-25").length
            });
            expect(divForEmbedDoc).to.equal(0);
        });

    });

});

describe('test call with initial parameter', function() {
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
        await page.goto('http://localhost:3000/?cadn=04-25');
        await page.waitForSelector('#main');
    });

    after (async function(){
        //await browser.close();
        //await server.close();
    });

    it('test data', async function() {
            this.timeout(10000);
            let nodeId = await page.evaluate(() => {
                return [
                    $("#node_cn_04-25 div.w2ui-node-caption").text(),
                    $("#node_tom_1_cn_04-25 div.w2ui-node-caption").text(),
                    $("#node_doc_1_0_tom_1_cn_04-25 div.w2ui-node-caption").text(),
                    $("#node_doc_1_1_tom_1_cn_04-25 div.w2ui-node-caption").text(),
                    $("#node_tom_2_cn_04-25 div.w2ui-node-caption").text(),
                    $("#node_doc_2_0_tom_2_cn_04-25 div.w2ui-node-caption").text(),
                    $("#node_doc_2_1_tom_2_cn_04-25 div.w2ui-node-caption").text()
                ];
            });
            expect(nodeId).to.deep.equal([
                "04-25",
                "Vol 1",
                "volume 1 inventory04-25",
                "certificate_1_04-25",
                "Vol 2",
                "volume 2 inventory04-25",
                "certificate_2_04-25"
            ]);
        });
});

