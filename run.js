var fs = require('fs'),
    iconv = require('iconv-lite'),
    async = require('./lib/async.js');



var csvObj = {
    rows: {}
},
    baseLangName;

fs.readdir('i18n', function (err, files) {
    
    async.map(files, function (fname, callback) {
        var langName = fname.replace('.json', '');
        baseLangName = langName;
        
        var json = require('./i18n/' + fname);
        
        csvObj.rows[langName] = {};

        for (var p in json) {
            csvObj.rows[langName][p] = json[p];
        }
        
        callback();
    
    }, function () {
        
        //����ͷ������
        var content = 'status,label';
        for (var lang in csvObj.rows) {
            content += ',' + lang;
        }
        content += '\n';
        
        
        var rowList = [],
            rowIndex = 0;

        for (var vname in csvObj.rows[baseLangName]) {
            rowList[rowIndex++] = [vname];
        }
        

        rowList.forEach(function (arr) {
            var vname = arr[0];
            
            content += ',';
            for (var p in csvObj.rows) {
                var item = csvObj.rows[p][vname];

                if(item === undefined){
                    arr.push("\"\"");
                }
                else{
                    arr.push("\"" + item.replace(/"/g, '\\"').replace(/\\n/g, '/r/n') + "\"");
                }

            }

            content += arr.join(',') + '\n';
        });


        fs.writeFile('csv/i18n.csv', content, function (err) {
            if(err){
                console.log(err);
            }
            else{
                console.log('i18n.csv created');
            }
        });


    });


});