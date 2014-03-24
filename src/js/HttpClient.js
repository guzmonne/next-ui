(function (nx) {
    var HttpClient = nx.define('nx.HttpClient',{
        static: true,
        methods: {
            /**
             * Ajax send.
             * @param options
             */
            send: function (options) {
                var xhr = new XMLHttpRequest();
                var callback = options.callback || function () {
                };

                xhr.open(
                    options.method || 'GET',
                    options.url,
                    true
                );

                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        var type = xhr.getResponseHeader('Content-Type');
                        var result = (type.indexOf('application/json') >= 0) ? JSON.parse(xhr.responseText) : xhr.responseText;
                        callback(result);
                    }
                };

                xhr.setRequestHeader('Content-Type','application/json');
                xhr.send(nx.is(options.data,'Object') ? JSON.stringify(options.data) : options.data);
            },
            /**
             * Get request
             * @param url
             * @param callback
             * @constructor
             */
            GET: function (url,callback) {
                this.send({
                    url: url,
                    method: 'GET',
                    callback: callback
                });
            },
            /**
             * Post request
             * @param url
             * @param data
             * @param callback
             * @constructor
             */
            POST: function (url,data,callback) {
                this.send({
                    url: url,
                    method: 'POST',
                    data: data,
                    callback: callback
                });
            },
            /**
             * Put request
             * @param url
             * @param data
             * @param callback
             * @constructor
             */
            PUT: function (url,data,callback) {
                this.send({
                    url: url,
                    method: 'PUT',
                    data: data,
                    callback: callback
                });
            },
            /**
             * Delete request
             * @param url
             * @param callback
             * @constructor
             */
            DELETE: function (url,callback) {
                this.send({
                    url: url,
                    method: 'DELETE',
                    callback: callback
                });
            }
        }
    });
})(nx);