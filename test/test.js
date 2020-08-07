const assert = require('assert');
const puppeteer = require('puppeteer');
const should = require('chai').should();
let {testData}  = require('./testData');

describe('test  function', function() {

    it('test treeClass', async function() {
        const Tree = require('../lib/treeClass')
        const tree = new Tree;
        var objData =  {cadn: '75/040508-559', invn: '75/040508-559', adr: 'text address'};
        tree._addNode('cadn', '75/040508-559','icon-folder', null, objData);
        var docData = {fullName: 'full Name'}
        tree._addNode('tom1', 'Том 1', 'icon-folder','cadn', );
        tree._addNode('doc11', 'док 1', 'icon-page', 'tom1', docData, 'a11.pdf');
        tree._addNode('doc12', 'док 2', 'icon-page', 'tom1', docData, 'a12.pdf')

        tree._addNode('tom2', 'Том 2', 'icon-folder','cadn');
        tree._addNode('doc21', 'док 1', 'icon-page', 'tom2', docData, 'a21.pdf');
        tree._addNode('doc22', 'док 2', 'icon-page', 'tom2', docData, 'a22.pdf')

        tree._addNode('cadn', '75/040508-559','icon-folder');
        tree._addNode('tom1', 'Том 1', 'icon-folder','cadn');
        tree._addNode('doc11', 'док 1', 'icon-page', 'tom1', docData, 'a111.pdf');

        var allItem = [];
        tree._traverse((node) => {
            allItem.push(node.id);
        });
        assert.deepStrictEqual(allItem,['cadn', 'tom1', 'doc11', 'doc12', 'tom2', 'doc21', 'doc22']);

        assert.deepStrictEqual(tree._displayLeafs('tom1'),[{ id: 'doc11', text: 'док 1', img: 'icon-page', objData: {fullName: "full Name"}, fileImg: "a11.pdf", nodes: [] },
            { id: 'doc12', text: 'док 2', img: 'icon-page', objData: {fullName: "full Name"}, fileImg: "a12.pdf", nodes: [] }]);
        assert.deepStrictEqual(tree._search('doc22'),{ id: 'doc22', text: 'док 2', img: 'icon-page', objData: {fullName: "full Name"}, fileImg: "a22.pdf", nodes: [] });

        tree._removeNode('doc12');
        tree._search('doc12').should.to.be.equal("Not Found");
        allItem = [];
        tree._traverse((node) => {
            allItem.push(node.id);
        });
        assert.deepStrictEqual(allItem,['cadn', 'tom1', 'doc11', 'tom2', 'doc21', 'doc22']);
    });

    it('test dbSqlite.getDocs function search cadn from SQLITE', async function() {
        var dbSqlite = require('../lib/dbSqlite');

        let db = await dbSqlite.setDBtestData(testData)
            .catch(err => {
                console.log(err);
                return ({error:err.message})
            });

        db.name.should.equal(":memory:");
        db.open.should.equal(true);

        res = await dbSqlite.getDocs('7504-361',db); //return empty object
        assert.deepStrictEqual(res.error,undefined);
        assert.deepStrictEqual(res,[]);

        res = await dbSqlite.getDocs('7504-36',db); //return some array object
        assert.deepStrictEqual(res.error,undefined);
        res.length.should.to.be.equal(4);
    })

    it('test dbSqlite.createDocsTree function ', async function() {
        var dbSqlite = require('../lib/dbSqlite');

        var tree = await dbSqlite.createDocsTree(testData.data);
        var allItem = [];
        tree._traverse((node) => {
            allItem.push({[node.id]:node.text, fileImg: node.fileImg});
        });
        console.log(tree._root.nodes);
        assert.deepStrictEqual(allItem,[
            {"arrayDocsTree": undefined, "fileImg": undefined},
            {"cadn04-25": "04-25", "fileImg": undefined}, //TODO
            {"tom1": "Том 1", "fileImg": undefined},
            {"doc_1_0": "volume inventory", "fileImg": "inventory.pdf"},
            {"doc_1_1": "certificate_1_at_05-03-2003","fileImg": "certificate_1_at_05-03-2003.1.pdf"},
            {"tom2":"Том 2", "fileImg": undefined},
            {"doc_2_0": "volume inventory", "fileImg": "inventory.pdf"},
            {"doc_2_1": "certificate_2_at_11-01-2006", "fileImg": "certificate_2_at_11-01-2006.5.pdf"},

        ]);
    })

    it('test getDocsTree function ', async function() {
        var dbSqlite = require('../lib/dbSqlite');
        var resEmpty = await dbSqlite.getDocsTree('75:09:300429:10171','db/testData.db');
        resEmpty.error.should.to.be.equal('the object not founded');
        var res = await dbSqlite.getDocsTree('75:09:300429:1017','db/testData.db');
        assert.deepStrictEqual(res.error, undefined);
        //console.log(res._displayLeafs('tom2'));
        res._traverse((node) => {
            console.log(node.id,node.text);
        });
        assert.deepStrictEqual(res._search('doc_2_0'),{"id": "doc_2_0", "img": "icon-page", "nodes": [], "text": "Опись дела от 26.09.2014 г.",
            fileImg: "e:\\Scan_img\\75 09 300429 1017\\Опись дела от 26.09.2014 г..1.pdf",
            objData: {
                "addInfo": undefined, //TODO
                "createAt": undefined,
                "createUser": undefined,
                "fullName": undefined,
                "updateAt": undefined
            }
        });
    })
})
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
    })

    describe('test ', function() {

        beforeEach(async function () {
            await page.evaluate(() => {
                var spreadsheet = null; //destroy previous spreadsheet
            });
            await page.waitForSelector('#fldSearch');
        });
        function responseParse(url) {
            var request = require("request");
            return new Promise(function(resolve, reject) {
                request({url : url},
                    function (error, response, body) {
                        if (error) {
                            console.log('Couldn’t get page because of error: ' + error);
                            reject(error);
                            return;
                        } else if (response.statusCode != 200) {
                            var err = new Error('Response error');
                            err.message = response.statusCode + ' ' + body;
                            console.log('Couldn’t get page because of response error: ' + err);
                            reject(err);
                            return;
                        }
                        resolve(body);
                    });
            });
        };

        it('test get get docsTree', async function() {
            this.timeout(10000);
            var result = await responseParse('http://localhost:3000/docstree?cadn=75:32:040508:2559');
            console.log(result)
        })
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

