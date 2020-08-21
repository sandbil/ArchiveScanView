let options = {
    pdfOpenParams: {
        navpanes: 0,
        toolbar: 0,
        statusbar: 0,
        view: "FitH",
        //view: "FitV",
        pagemode: "thumbs",
        //page: 2
    },
    //forcePDFJS: true,
    PDFJS_URL: "/pdfjs/web/viewer.html"
};

let config = {
    layout: {
        name: 'layout',
        padding: 0,
        panels: [
            //{ type: 'top', size: 32, content: '<div>Top Panel</div>', style: 'border-bottom: 1px solid silver;' },
            { type: 'top', size: 32, style: 'border-bottom: 1px solid silver;',
                /* toolbar: {
                     items: [
                         { type: 'check',  id: 'item1', caption: 'Check', img: 'icon-page', checked: true },
                         { type: 'spacer' },
                         { type: 'button',  id: 'item5',  caption: 'Item 5', icon: 'w2ui-icon-check', hint: 'Hint for item 5' }
                     ],
                     onClick: function (event) {
                         //this.owner.content('main', event);
                         w2ui.layout.html('main', event);
                     }
                 }*/
            },
            { type: 'left', size: 400, resizable: true, minSize: 200,
                toolbar: {
                    items: [
                        { type: 'html',  id: 'idFldSearch',
                            html: function (item) {
                                return '<div style="padding: 3px 10px;"> '+
                                    w2utils.lang('Cad. №:')+
                                    '    <input id="fldSearch" size="20" placeholder="'+
                                    w2utils.lang('Enter cad.number')+
                                    '" onchange="changeCadn(this.value)" '+
                                    '         style="padding: 3px; border-radius: 2px; border: 1px solid silver" value="'+ (item.value || '') +'"/>'+
                                    '</div>';
                            }
                        },
                        { type: 'break' },
                        { type: 'button', id: 'item6', icon: 'icon-reload', text: w2utils.lang('Refresh'),
                            tooltip: 'Click to refresh the entire list of documents',
                            onClick: function (event) { searchCadn(this.get('idFldSearch').value)}
                        }
                    ]
                }
            },
            { type: 'main', overflow: 'hidden',
                style: 'background-color: white; border: 1px solid silver; border-top: 0px; padding: 10px;',
                tabs: {
                    active: 'tab0',
                    tabs: [{ id: 'tab0', text: 'Initial Tab' }],
                    onClick: function (event) {
                       // w2ui.layout.html('main', 'Active tab: '+ event.target);
                        $('#layout_layout_panel_main .w2ui-panel-content .divtab').hide();
                        $('#layout_layout_panel_main .w2ui-panel-content #' + event.target).show();
                        w2ui.sidebar.select(event.target);
                    },
                    onClose: function (event) {
                        this.click('tab0');
                        $('#layout_layout_panel_main .w2ui-panel-content #' + event.target).remove();
                    }
                }
            },
            { type: 'bottom', size: 16, content: '<div>bottom Panel</div>', style: 'border-bottom: 1px solid silver;' },
        ]
    },
    sidebar: {
        name: 'sidebar',
        //topHTML: 'some text',
        nodes: [

        ],
        onDblClick: function (event) {
            console.log(event.target);
            console.log(event.object.tag);
            const tabs = w2ui.layout_main_tabs;
            if (tabs.get(event.target)) {
                //tabs.select(event.target);
                //w2ui.layout.html('main', 'Tab Selected');
                $('#layout_layout_panel_main .w2ui-panel-content .divtab').hide();
                tabs.select(event.target);
                $('#layout_layout_panel_main .w2ui-panel-content #' + event.target).show();
            } else {
                if (event.target.slice(0,3) === 'doc'){
                    $('#layout_layout_panel_main .w2ui-panel-content .divtab').hide();
                    tabs.add({ id: event.target, text: event.object.text, closable: true });
                    $("#layout_layout_panel_main .w2ui-panel-content").append('<div id="'+event.target+'" class = "divtab">'+event.object.text+'</div>');
                    // w2ui.layout.html('main', 'New tab added' + event.object.objData.fullName);
                    tabs.select(event.target);
                    PDFObject.embed("/getdoc?filepdf=" + event.object.fileImg, "#"+event.target, options);
                }
            }
        }
    }
};

function changeCadn(cadn) {
    ind = 1;
    let tb = w2ui.layout_main_tabs;
    let tabs = tb.get();
    tabs.splice(tabs.indexOf('tab0'), 1);
    tabs.forEach(tab => {
        $("#"+tab).remove()
    });
    tb.remove.apply(tb, tabs);

    searchCadn(cadn);
};

function searchCadn(cadn) {
    w2ui.layout_left_toolbar.set('idFldSearch', { value: cadn });
    w2ui.sidebar.lock('', true);
    $.ajax({
        type: "POST",
        url: 'docstree',
        data: {cadn:cadn},
        success: function(data){
            if (data.error) {
                w2alert(cadn + ' - ' + w2utils.lang(data.error));
                w2ui.sidebar.unlock();
            } else {
                w2ui['sidebar'].nodes = [];
                w2ui['sidebar'].add(data._root.nodes);
                w2ui.sidebar.unlock();
            }
        },
        error: function(err){ w2alert(w2utils.lang('Error')+': ' + cadn + ' - ' +  w2utils.lang('The request failed'))
            .ok(function () { console.log(JSON.stringify(err)); }); w2ui.sidebar.unlock();}
    });


}

$(function () {
    // initialization
    w2utils.locale(navigator.language);
    $('#main').w2layout(config.layout);
    //w2ui.layout.content('top',$('#toolbar').w2toolbar(config.js.topToolBar));
    w2ui.layout.html('left', $().w2sidebar(config.sidebar));

    searchCadn(w2ui.cadn);
});