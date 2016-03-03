var fs = require('fs'),
    Q = require('./lib/q.js'),
    async = require('./lib/async.js');



readCSV().then(function (text) {
    
    var rows = text.split('\n'),
        cols = rows.splice(0, 1)[0].split(','),
        table = [];
    
       
    rows.forEach(function (r) {
        table.push(csv2list(r));
    });
    
    for (var i = 2, len = cols.length; i < len; i++) {
        var lang = cols[i],
            json = {};

        table.forEach(function (r) {
            var label = r[1];

            json[label] = r[i];
        });


        writeJson(lang, json).then(function () {
            console.log(lang + '.json finished');  
        }, function (e) {
            console.log(lang + '.json error!');  
        });
    }



    //rows.forEach(function (r) {


    //});

    
})
.done(function () {
    console.log('done');
});


function readCSV() {
    var deferred = Q.defer();
    
    fs.readFile('csv/i18n.csv', 'utf-8', function (error, text) {

        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve(text);
        }

    });

    return deferred.promise;
}

function writeJson(lang, json) {
    var deferred = Q.defer();    
    
    fs.writeFile('exi18n/' + lang.replace(/\n/g, '').replace(/\s+/g, '') + '.json', JSON.stringify(json), {encoding: 'utf-8', flag: 'w'}, function (error) {
        if (error) {
            deferred.reject(new Error(error));
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
}


function csv2list(csvStr) {
    var list = [];
    
    var hasOpen = false,
        lastCell = '';
    
    for (var i = 0, len = csvStr.length; i < len; i++) {
        if (csvStr[i] === '"' && !hasOpen) {
            hasOpen = true;
        }
        else if (hasOpen && csvStr[i] === '"' && (csvStr[i - 1] && csvStr[i - 1] === '"' || csvStr[i + 1] && csvStr[i + 1] === '"')) {
            lastCell += csvStr[i];
        }
        else if (hasOpen && csvStr[i] === '"' && (csvStr[i + 1] == null || csvStr[i - 1] && csvStr[i - 1] != '"' || csvStr[i + 1] && csvStr[i + 1] != '"')) {
            hasOpen = false;
        }
        else if ((csvStr[i] === ',' && !hasOpen)) {
            list.push(lastCell);
            lastCell = '';
        }        
        else {
            lastCell += csvStr[i];
        }


    }
    list.push(lastCell);
    
    return list;

}



