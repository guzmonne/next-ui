(function (global, document, undefined) {

    var ln, scriptSrc, match;
    var path = '', xPath;
    var scripts = document.getElementsByTagName('script');
    for (i = 0, ln = scripts.length; i < ln; i++) {
        scriptSrc = scripts[i].src;
        match = scriptSrc.match('NeXtGit.*');
        if (match) {
            path = scriptSrc.substring(0, scriptSrc.length - match[0].length);
            break;
        }
    }

    var http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            var json = JSON.parse(http.responseText);
            for (var h = 0; h < json.scripts.length; h++) {
                document.write("<script type='text/javascript' src='" + xPath + json.scripts[h] + "'></script>");
            }
        }
    };
//    xPath = path + "NeXtGit/next-core/";
//    http.open("GET", xPath + "files.json", false);
//    http.send();
//
//    xPath = path + "NeXtGit/next-ui/";
//    http.open("GET", xPath + "files.json", false);
//    http.send();

//
    xPath = path + "NeXtGit/next-ui-components/";
    http.open("GET", xPath + "files.json?" + Math.random(), false);
    http.send();

    xPath = path + "NeXtGit/next-graphic/";
    http.open("GET", xPath + "files.json?" + Math.random(), false);
    http.send();




}(window, document, undefined));

