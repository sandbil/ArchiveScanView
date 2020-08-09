exports.testData = {
  createTable: 'CREATE TABLE "SCAN_DOCUMENTS" (' +
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
  '"vol_nmb" VARCHAR2(20),' +
  '"ordr" NUMERIC' +
  ')',
  fields:  ' id, inv_nomer, cad_number, cond_number, adr_txt, name_doc, full_name_doc, ver, file_img, create_user, created_at, updated_at, add_info, vol_nmb, ordr',
  bindPrm: '@id,@inv_nomer,@cad_number,@cond_number,@adr_txt,@name_doc,@full_name_doc,@ver,@file_img,@create_user,@created_at,@updated_at,@add_info,@vol_nmb,@ordr',
  data: [
  {id:1,inv_nomer:"321",cad_number:"04-25",cond_number:"75-135/А/16",adr_txt:"34 New Road London W34 8TN",name_doc:"",           full_name_doc:"volume 1 inventory04-25",              ver:1,file_img:"inventory.pdf",                 create_user:"somebody",created_at:"07/30/2019 16:40:01",updated_at:"",add_info:"",vol_nmb:"1",ordr:0},
  {id:2,inv_nomer:"321",cad_number:"04-25",cond_number:"75-135/А/16",adr_txt:"34 New Road London W34 8TN",name_doc:"certificate",full_name_doc:"certificate_1_04-25",ver:3,file_img:"certificate_1_at_05-03-2003.1.pdf",create_user:"somebody",created_at:"07/30/2019 16:39:52",updated_at:"",add_info:"",vol_nmb:"1",ordr:1},
  {id:3,inv_nomer:"321",cad_number:"04-25",cond_number:"75-135/А/16",adr_txt:"34 New Road London W34 8TN",name_doc:"",           full_name_doc:"volume 2 inventory04-25",              ver:2,file_img:"inventory2.pdf",                 create_user:"somebody",created_at:"07/30/2019 16:40:01",updated_at:"",add_info:"",vol_nmb:"2",ordr:0},
  {id:4,inv_nomer:"321",cad_number:"04-25",cond_number:"75-135/А/16",adr_txt:"34 New Road London W34 8TN",name_doc:"certificate",full_name_doc:"certificate_2_04-25",ver:5,file_img:"certificate_2_at_11-01-2006.5.pdf",create_user:"somebody",created_at:"07/30/2019 16:39:52",updated_at:"",add_info:"",vol_nmb:"2",ordr:1},

  {id:5,inv_nomer:"502",cad_number:"105-34",cond_number:"75-158/B/4",adr_txt:"89 West Street London N68 3HF",name_doc:"",full_name_doc:"volume inventory105-34",       ver:1,file_img:"inventory3.pdf",               create_user:"somebody",created_at:"08/30/2019 16:40:01",updated_at:"10/05/2019 16:40:01",add_info:"need recheck",vol_nmb:"1",ordr:0},
  {id:6,inv_nomer:"502",cad_number:"105-34",cond_number:"75-158/B/4",adr_txt:"89 West Street London N68 3HF",name_doc:"",full_name_doc:"reference_at_105-34",ver:3,file_img:"reference_at_10-10-1998.1.pdf",create_user:"somebody",created_at:"08/30/2019 16:39:52",updated_at:"10/06/2019 16:40:01",add_info:"",vol_nmb:"1",ordr:1},

  {id:12,inv_nomer:"605",cad_number:"7504-36",cond_number:"",adr_txt:"03 Chester Road London WC59 0JZ",name_doc:"",full_name_doc:"volume inventory7504-36",           ver:1,file_img:"inventory4.pdf",                    create_user:"somebody",created_at:"07/30/2019 16:40:01",updated_at:"",add_info:"need signing",vol_nmb:"",ordr:0},
  {id:13,inv_nomer:"605",cad_number:"7504-36",cond_number:"",adr_txt:"03 Chester Road London WC59 0JZ",name_doc:"",full_name_doc:"certificate_1_7504-36",ver:3,file_img:"certificate_1_at_05-03-2003.1.pdf",create_user:"somebody",created_at:"07/30/2019 16:39:52",updated_at:"",add_info:"",vol_nmb:"",ordr:1},
  {id:14,inv_nomer:"605",cad_number:"7504-36",cond_number:"",adr_txt:"03 Chester Road London WC59 0JZ",name_doc:"",full_name_doc:"volume 1 inventory7504-36",           ver:2,file_img:"inventory5.pdf",                    create_user:"somebody",created_at:"07/30/2019 16:40:01",updated_at:"",add_info:"",vol_nmb:"1",ordr:0},
  {id:15,inv_nomer:"605",cad_number:"7504-36",cond_number:"",adr_txt:"03 Chester Road London WC59 0JZ",name_doc:"",full_name_doc:"certificate_2_7504-36",ver:5,file_img:"certificate_2_at_11-01-2006.5.pdf",create_user:"somebody",created_at:"07/30/2019 16:39:52",updated_at:"",add_info:"",vol_nmb:"1",ordr:1},
]
};

exports.testTreeClass = [
    {"id": "cn_04-25","text": "04-25","img": "icon-folder","objData": "objData","fileImg": undefined, "nodes": [
       {"id": "tom_1_cn_04-25","text": "Vol 1", "img": "icon-folder","objData": undefined,"fileImg": undefined, "nodes": [
          {"id": "doc_1_0_tom_1_cn_04-25", "text": "volume 1 inventory04-25","img": "icon-page","objData": "docData", "fileImg": "inventory.pdf", "nodes": []},
          {"id": "doc_1_1_tom_1_cn_04-25","text": "certificate_1_04-25","img": "icon-page","objData": "docData","fileImg": "certificate_1_at_05-03-2003.1.pdf", "nodes": []}
       ]},
       { "id": "tom_2_cn_04-25","text": "Vol 2","img": "icon-folder", "objData": undefined, "fileImg": undefined, "nodes": [
          {"id": "doc_2_0_tom_2_cn_04-25","text": "volume 2 inventory04-25","img": "icon-page","objData": "docData", "fileImg": "inventory2.pdf", "nodes": []},
          {"id": "doc_2_1_tom_2_cn_04-25", "text": "certificate_2_04-25", "img": "icon-page","objData": "docData", "fileImg": "certificate_2_at_11-01-2006.5.pdf", "nodes": []}
       ]}
    ]},
    {"id": "cn_105-34","text": "105-34","img": "icon-folder","objData": "objData", "fileImg": undefined,"nodes": [
       {"id": "tom_1_cn_105-34", "text": "Vol 1","img": "icon-folder", "objData": undefined, "fileImg": undefined,"nodes": [
          {"id": "doc_1_0_tom_1_cn_105-34","text": "volume inventory105-34","img": "icon-page","objData": "docData","fileImg": "inventory3.pdf","nodes": []},
          {"id": "doc_1_1_tom_1_cn_105-34","text": "reference_at_105-34", "img": "icon-page","objData": "docData", "fileImg": "reference_at_10-10-1998.1.pdf", "nodes": []}
       ]}
    ]},
    {"id": "cn_7504-36", "text": "7504-36", "img": "icon-folder", "objData": "objData","fileImg": undefined, "nodes": [
       {"id": "tom__cn_7504-36", "text": "Vol ","img": "icon-folder","objData": undefined,"fileImg": undefined,"nodes": [
          {"id": "doc__0_tom__cn_7504-36","text": "volume inventory7504-36", "img": "icon-page", "objData": "docData", "fileImg": "inventory4.pdf", "nodes": []},
          {"id": "doc__1_tom__cn_7504-36","text": "certificate_1_7504-36","img": "icon-page", "objData": "docData","fileImg": "certificate_1_at_05-03-2003.1.pdf","nodes": []}
       ]},
       {"id": "tom_1_cn_7504-36", "text": "Vol 1","img": "icon-folder","objData": undefined,"fileImg": undefined,"nodes": [
          {"id": "doc_1_0_tom_1_cn_7504-36", "text": "volume 1 inventory7504-36","img": "icon-page","objData": "docData","fileImg": "inventory5.pdf", "nodes": []},
          {"id": "doc_1_1_tom_1_cn_7504-36","text": "certificate_2_7504-36","img": "icon-page","objData": "docData", "fileImg": "certificate_2_at_11-01-2006.5.pdf", "nodes": []}
       ]}
    ]}
];

exports.treeTest = {
    "_root": {
        "id": "arrayDocsTree",
        "nodes": [{
            "id": "cn_04-25",
            "text": "04-25",
            "img": "icon-folder",
            "objData": {"cadn": "04-25", "invn": "321", "adr": "34 New Road London W34 8TN"},
            "nodes": [{
                "id": "tom_1_cn_04-25",
                "text": "Vol 1",
                "img": "icon-folder",
                "nodes": [{
                    "id": "doc_1_0_tom_1_cn_04-25",
                    "text": "volume 1 inventory04-25",
                    "img": "icon-page",
                    "objData": {
                        "fullName": "volume 1 inventory04-25",
                        "createUser": "somebody",
                        "createAt": "07/30/2019 16:40:01",
                        "updateAt": "",
                        "addInfo": ""
                    },
                    "fileImg": "inventory.pdf",
                    "nodes": []
                }, {
                    "id": "doc_1_1_tom_1_cn_04-25",
                    "text": "certificate_1_04-25",
                    "img": "icon-page",
                    "objData": {
                        "fullName": "certificate_1_04-25",
                        "createUser": "somebody",
                        "createAt": "07/30/2019 16:39:52",
                        "updateAt": "",
                        "addInfo": ""
                    },
                    "fileImg": "certificate_1_at_05-03-2003.1.pdf",
                    "nodes": []
                }]
            }, {
                "id": "tom_2_cn_04-25",
                "text": "Vol 2",
                "img": "icon-folder",
                "nodes": [{
                    "id": "doc_2_0_tom_2_cn_04-25",
                    "text": "volume 2 inventory04-25",
                    "img": "icon-page",
                    "objData": {
                        "fullName": "volume 2 inventory04-25",
                        "createUser": "somebody",
                        "createAt": "07/30/2019 16:40:01",
                        "updateAt": "",
                        "addInfo": ""
                    },
                    "fileImg": "inventory2.pdf",
                    "nodes": []
                }, {
                    "id": "doc_2_1_tom_2_cn_04-25",
                    "text": "certificate_2_04-25",
                    "img": "icon-page",
                    "objData": {
                        "fullName": "certificate_2_04-25",
                        "createUser": "somebody",
                        "createAt": "07/30/2019 16:39:52",
                        "updateAt": "",
                        "addInfo": ""
                    },
                    "fileImg": "certificate_2_at_11-01-2006.5.pdf",
                    "nodes": []
                }]
            }]
        }]
    }
}

