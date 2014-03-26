(function (nx, util, global) {

    /**
     * Topology device icons collection
     * @class nx.graphic.Icons
     * @static
     */
    var ICONS = nx.define('nx.graphic.Icons', {
        static: true,
        methods: {
            /**
             * Get icons collection
             */
            icons: {},
            /**
             * Get icon by type
             * @param type {String}
             * @returns {element}
             * @method get
             */
            get: function (type) {
                return this.icons[type] || this.icons.unknown;
            },
            /**
             * Get icon's svg string
             * @param type {String}
             * @returns {element}
             * @method getSVGString
             */
            getSVGString: function (type) {
                return topology_icon[type].icon;
            },
            /**
             * Get all types list
             * @returns {Array}
             * @method getTypeList
             */
            getTypeList: function () {
                return Object.keys(topology_icon);
            },
            /**
             * Register a new icon to this collection
             * @method registerIcon
             * @param name {String} icon's name
             * @param url {URL} icon's url
             * @param width {Number} icon's width
             * @param height {Number} icon's height
             */
            registerIcon: function (name, url, width, height) {
                var icon1 = document.createElementNS(NS, "image");
                icon1.setAttributeNS(XLINK, 'href', url);
                this.icons[name] = {
                    size: {
                        width: width,
                        height: height
                    },
                    icon: icon1.cloneNode(true),
                    name: name
                };
            },
            /**
             * Iterate all icons
             * @param inCallback {Function}
             * @param [inContext] {Object}
             * @private
             */
            __each__: function (inCallback, inContext) {
                var callback = inCallback || function () {
                };
                nx.each(topology_icon, function (obj, name) {
                    var icon = obj.icon;
                    callback.call(inContext || this, icon, name, topology_icon);
                });
            }
        }
    });


    var LINK = 'xmlns:xlink="http://www.w3.org/1999/xlink"';
    var XLINK = 'http://www.w3.org/1999/xlink';
    var XMLNS = ' xmlns="http://www.w3.org/2000/svg"';
    var NS = "http://www.w3.org/2000/svg";


    var bgColor = "#1F6EEE";


    //
    // class="bg"
    //fill="#1F6EEE" stroke="#1F6EEE"
    // class="stroke"


    var topology_icon = {
        switch: {
            width: 36,
            height: 36,
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" ' + LINK + ' x="0px" y="0px" width="61px" height="61px" viewBox="0 0 61 61" enable-background="new 0 0 61 61" xml:space="preserve"><symbol id="Arrow_25" viewBox="-22.86 -13.14 45.721 26.279"><polygon fill="none" points="-22.86,-13.14 22.86,-13.14 22.86,13.14 -22.86,13.14"/><polygon class="white" fill="#FFFFFF" points="-20.298,-2.933 5.125,-2.933 5.125,-9.242 14.827,0.001 5.125,9.242 5.125,2.934 -20.298,2.934 "/></symbol><rect x="0.5" y="0.5"  class="bg" stroke-miterlimit="10" width="60" height="60"/><use xlink:href="#Arrow_25" width="45.721" height="26.279" id="XMLID_27_" x="-22.86" y="-13.14" transform="matrix(0.7161 -0.0022 -0.0022 -0.7161 42.4775 24.4277)" overflow="visible"/><use xlink:href="#Arrow_25" width="45.721" height="26.279" id="XMLID_28_" x="-22.86" y="-13.14" transform="matrix(0.7161 -0.0022 -0.0022 -0.7161 42.4775 47.0254)" overflow="visible"/><use xlink:href="#Arrow_25" width="45.721" height="26.279" id="XMLID_29_" x="-22.86" y="-13.14" transform="matrix(-0.7161 -0.0022 0.0022 -0.7161 17.2168 35.7266)" overflow="visible"/><use xlink:href="#Arrow_25" width="45.721" height="26.279" id="XMLID_30_" x="-22.86" y="-13.14" transform="matrix(-0.7161 -0.0022 0.0022 -0.7161 17.2168 13.1289)" overflow="visible"/></svg>'
        },
        router: {
            width: 40,
            height: 40,
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" ' + LINK + ' x="0px" y="0px" width="71px" height="74.074px" viewBox="0 0 71 74.074" enable-background="new 0 0 71 74.074" xml:space="preserve"><symbol id="Arrow_25" viewBox="-22.86 -13.14 45.721 26.279"><polygon fill="none" points="-22.86,-13.14 22.86,-13.14 22.86,13.14 -22.86,13.14"/><polygon class="white" fill="#FFFFFF" points="-20.298,-2.933 5.125,-2.933 5.125,-9.242 14.827,0.001 5.125,9.242 5.125,2.934 -20.298,2.934"/></symbol><circle  class="bg" stroke-miterlimit="10" cx="35.977" cy="36.896" r="31.121" /><use xlink:href="#Arrow_25" width="45.721" height="26.279" x="-22.86" y="-13.14" transform="matrix(0.4768 0.5685 0.5685 -0.4768 26.4009 25.2617)" overflow="visible"/><use xlink:href="#Arrow_25" width="45.721" height="26.279" x="-22.86" y="-13.14" transform="matrix(0.6118 -0.4199 -0.4199 -0.6118 50.9985 25.4111)" overflow="visible"/><use xlink:href="#Arrow_25" width="45.721" height="26.279" x="-22.86" y="-13.14" transform="matrix(-0.4537 -0.587 -0.587 0.4537 45.1548 49.0225)" overflow="visible"/><use xlink:href="#Arrow_25" width="45.721" height="26.279" x="-22.86" y="-13.14" transform="matrix(-0.587 0.4537 0.4537 0.587 21.7271 48.002)" overflow="visible"/></svg>'
        },
        accesspoint: {
            width: 40,
            height: 40,
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" ' + LINK + ' x="0px" y="0px" width="51.627px" height="41.148px" viewBox="0 0 51.627 41.148" enable-background="new 0 0 51.627 41.148" xml:space="preserve"><g id="Layer_1"></g><g id="Layer_2"></g><g id="Layer_4"></g><g id="Layer_5"></g><g id="Layer_6"></g><g id="Layer_7"></g><g id="Layer_8"> <rect x="0.5" y="0.5"  class="bg" stroke-miterlimit="10" width="50.627" height="40.148" /> <g> <path fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-miterlimit="1" d="M51.588,20.932c0,0-5.796,20.432-12.771-0.044c-6.961-20.475-12.737,0.127-12.737,0.127s-5.781,20.442-12.748-0.034C6.359,0.5,0.582,20.917,0.582,20.917"/> <path fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-miterlimit="1" d="M0.585,21.036c0,0,5.799,20.416,12.774-0.061c6.965-20.476,12.774-0.044,12.774-0.044s5.794,20.432,12.758-0.044c6.968-20.475,12.745,0.127,12.745,0.127"/> </g></g><g id="Layer_3"></g></svg>'
        },
        asr1000series: {
            width: 40,
            height: 40,
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" ' + LINK + ' x="0px" y="0px" width="52.623px" height="50.838px" viewBox="0 0 52.623 50.838" enable-background="new 0 0 52.623 50.838" xml:space="preserve"><symbol id="Arrow_25" viewBox="-22.86 -13.14 45.721 26.279"> <polygon fill="none" points="-22.86,-13.14 22.86,-13.14 22.86,13.14 -22.86,13.14 "/> <g> <polygon class="white" fill="#FFFFFF" points="-20.298,-2.933 5.125,-2.933 5.125,-9.242 14.827,0.001 5.125,9.242 5.125,2.934 -20.298,2.934 "/> </g></symbol><g id="Layer_1"></g><g id="Layer_2"></g><g id="Layer_4"></g><g id="Layer_5"></g><g id="Layer_6"></g><g id="Layer_7"></g><g id="Layer_8"> <g> <polygon  class="bg" stroke-miterlimit="10" points="15.845,49.447 1.508,35.111 1.508,14.836 15.845,0.5 36.118,0.5 50.454,14.836 50.454,35.111 36.118,49.447 "/> <use xlink:href="#Arrow_25" width="45.721" height="26.279" id="XMLID_28_" x="-22.86" y="-13.14" transform="matrix(0.3682 0.439 0.439 -0.3682 18.5723 15.7559)" overflow="visible"/> <use xlink:href="#Arrow_25" width="45.721" height="26.279" id="XMLID_27_" x="-22.86" y="-13.14" transform="matrix(0.4724 -0.3242 -0.3242 -0.4724 37.5635 15.8696)" overflow="visible"/> <use xlink:href="#Arrow_25" width="45.721" height="26.279" id="XMLID_26_" x="-22.86" y="-13.14" transform="matrix(-0.3503 -0.4532 -0.4532 0.3503 33.0508 34.1011)" overflow="visible"/> <use xlink:href="#Arrow_25" width="45.721" height="26.279" id="XMLID_25_" x="-22.86" y="-13.14" transform="matrix(-0.4532 0.3503 0.3503 0.4532 14.9629 33.313)" overflow="visible"/> <polygon opacity="0.6" fill="#119FB7" points="15.845,49.447 1.508,35.111 1.508,31.111 50.454,31.285 50.454,35.111 36.118,49.447 "/> <text transform="matrix(1.0368 0 0 1 12.1201 45.5674)" fill="#FAFCFC" font-family="Arial-BoldMT" font-size="14">QFP</text> </g></g><g id="Layer_3"></g></svg>'
        },
        camera: {
            width: 40,
            height: 40,
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" ' + LINK + ' x="0px" y="0px" width="58.406px" height="51.48px" viewBox="0 0 58.406 51.48" enable-background="new 0 0 58.406 51.48" xml:space="preserve"><g id="Layer_1"></g><g id="Layer_2"></g><g id="Layer_4"></g><g id="Layer_5"> <g> <rect x="10.59" y="1.682"  class="bg" stroke-miterlimit="10" width="44.236" height="31.065"/> <line fill="none" stroke="#FFFFFF" stroke-width="3" x1="54.826" y1="22.15" x2="10.59" y2="22.15"/> <g><path  class="bg" d="M8.743,4.639H1.969C0.882,4.639,0,7.844,0,11.799c0,3.948,0.882,7.151,1.969,7.151h6.774V4.639z"/> </g> <line fill="none"  class="stroke" stroke-width="3" stroke-miterlimit="10" x1="32.755" y1="35.804" x2="32.755" y2="51.48"/> <line fill="none"  class="stroke" stroke-width="3" stroke-miterlimit="10" x1="32.755" y1="35.804" x2="54.804" y2="48.938"/> <line fill="none"  class="stroke" stroke-width="3" stroke-miterlimit="10" x1="32.755" y1="35.804" x2="10.709" y2="48.938"/> <rect x="27.914" y="32.33"  class="bg" width="9.591" height="4.318"/> </g></g><g id="Layer_6"></g><g id="Layer_7"></g><g id="Layer_8"></g><g id="Layer_3"></g></svg>'

        },
        collisiondomain: {
            width: 30,
            height: 30,
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" ' + LINK + ' x="0px" y="0px" width="50.688px" height="50.687px" viewBox="0 0 50.688 50.687" enable-background="new 0 0 50.688 50.687" xml:space="preserve"><g id="Layer_1"></g><g id="Layer_2"></g><g id="Layer_4"> <rect  class="bg" width="50.688" height="50.687" /> <g> <path class="white" fill="#FFFFFF" d="M5.456,5.187V45.82h29.125V5.187H5.456z M32.413,43.763H7.627V7.243h24.786V43.763z"/> <rect x="21.7" y="9.886" class="white" fill="#FFFFFF" width="2.057" height="31.323"/> <rect x="27.11" y="9.886" class="white" fill="#FFFFFF" width="2.058" height="31.323"/> <rect x="16.287" y="9.886" class="white" fill="#FFFFFF" width="2.057" height="31.323"/> <rect x="10.876" y="9.886" class="white" fill="#FFFFFF" width="2.055" height="31.323"/> </g></g><g id="Layer_5"></g><g id="Layer_6"></g><g id="Layer_7"></g><g id="Layer_8"></g><g id="Layer_3"></g></svg>'

        },
        multilayerswitch: {
            width: 40,
            height: 40,
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" ' + LINK + ' x="0px" y="0px" width="54.455px" height="54.57px" viewBox="0 0 54.455 54.57" enable-background="new 0 0 54.455 54.57" xml:space="preserve"><g id="Layer_1"> <g> <g><rect  class="bg" width="48.907" height="48.906"/><g> <polyline class="white" fill="#FFFFFF" points="25.414,18.41 25.414,8.782 27.046,8.782 24.639,5.148 22.229,8.782 23.863,8.782 23.863,18.41 25.414,18.41 "/> <polyline class="white" fill="#FFFFFF" points="20.502,19.8 13.698,12.994 14.852,11.837 10.579,10.972 11.443,15.246 12.598,14.092 19.403,20.897 20.502,19.8 "/> <polyline class="white" fill="#FFFFFF" points="18.013,24.259 8.388,24.259 8.388,22.623 4.752,25.032 8.388,27.441 8.388,25.809 18.013,25.809 18.013,24.259 "/> <polyline class="white" fill="#FFFFFF" points="19.403,29.167 12.598,35.974 11.443,34.819 10.579,39.093 14.852,38.228 13.698,37.071 20.502,30.265 19.403,29.167 "/> <polyline class="white" fill="#FFFFFF" points="23.863,31.656 23.863,41.285 22.229,41.285 24.639,44.916 27.046,41.285 25.414,41.285 25.414,31.656 23.863,31.656 "/> <polyline class="white" fill="#FFFFFF" points="28.771,30.265 35.578,37.071 34.427,38.228 38.699,39.093 37.835,34.819 36.68,35.974 29.873,29.167 28.771,30.265 "/> <polyline class="white" fill="#FFFFFF" points="31.265,25.809 40.89,25.809 40.89,27.441 44.524,25.032 40.89,22.623 40.89,24.259 31.265,24.259 31.265,25.809 "/> <polyline class="white" fill="#FFFFFF" points="29.873,20.897 36.68,14.092 37.835,15.246 38.699,10.972 34.427,11.837 35.578,12.994 28.771,19.8 29.873,20.897 "/> <path fill="#FFFFFF"  class="white stroke" stroke-width="0.9625" d="M31.146,34.953c5.315-3.721,6.607-11.043,2.885-16.355 c-3.72-5.315-11.044-6.605-16.354-2.883c-5.311,3.72-6.605,11.043-2.886,16.357C18.511,37.379,25.834,38.67,31.146,34.953z"/></g> </g> <g><g> <rect x="32.987" y="33.099" class="white" fill="#FFFFFF" width="20.968" height="20.971"/> <rect x="32.987" y="33.099" fill="none"  class="stroke" stroke-miterlimit="10" width="20.968" height="20.971"/></g><g> <rect x="35.535" y="35.294"  class="bg" width="6.007" height="3.66"/> <rect x="46.006" y="35.294"  class="bg" width="6.007" height="3.66" /> <rect x="35.535" y="48.019"  class="bg" width="6.007" height="3.66"/> <rect x="46.006" y="48.019"  class="bg" width="6.007" height="3.66"/> <line  class="bg" stroke-miterlimit="10" x1="39.717" y1="37.126" x2="47.118" y2="37.126"/> <line  class="bg" stroke-miterlimit="10" x1="39.717" y1="49.851" x2="47.118" y2="49.851"/> <line  class="bg" stroke-miterlimit="10" x1="38.54" y1="48.394" x2="49.723" y2="38.955"/></g> </g> </g></g><g id="Layer_2"></g><g id="Layer_4"></g><g id="Layer_5"></g><g id="Layer_6"></g><g id="Layer_7"></g><g id="Layer_8"></g><g id="Layer_3"></g></svg>'

        },
        nexus5000: {
            width: 40,
            height: 40,
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" ' + LINK + ' x="0px" y="0px" width="51.99px" height="51.594px" viewBox="0 0 51.99 51.594" enable-background="new 0 0 51.99 51.594" xml:space="preserve"><symbol id="Arrow_25" viewBox="-22.86 -13.14 45.721 26.279"> <polygon fill="none" points="-22.86,-13.14 22.86,-13.14 22.86,13.14 -22.86,13.14 "/> <g> <polygon class="white" fill="#FFFFFF" points="-20.298,-2.933 5.125,-2.933 5.125,-9.242 14.827,0.001 5.125,9.242 5.125,2.934 -20.298,2.934 "/> </g></symbol><g id="Layer_1"></g><g id="Layer_2"> <g> <rect x="0.5" y="0.5"  class="bg" stroke-miterlimit="10" width="47.636" height="47.635"/> <use xlink:href="#Arrow_25" width="45.721" height="26.279" id="XMLID_64_" x="-22.86" y="-13.14" transform="matrix(0.5685 -0.0017 -0.0017 -0.5685 33.8271 19.4961)" overflow="visible"/> <use xlink:href="#Arrow_25" width="45.721" height="26.279" id="XMLID_63_" x="-22.86" y="-13.14" transform="matrix(0.5685 -0.0017 -0.0017 -0.5685 33.8271 37.4375)" overflow="visible"/> <use xlink:href="#Arrow_25" width="45.721" height="26.279" id="XMLID_62_" x="-22.86" y="-13.14" transform="matrix(-0.5685 -0.0017 0.0017 -0.5685 13.7725 28.4668)" overflow="visible"/> <use xlink:href="#Arrow_25" width="45.721" height="26.279" id="XMLID_61_" x="-22.86" y="-13.14" transform="matrix(-0.5685 -0.0017 0.0017 -0.5685 13.7725 10.5264)" overflow="visible"/> </g> <rect x="31.51" y="31.111" fill="#FFFFFF"  class="white stroke" stroke-miterlimit="10" width="20.48" height="20.482"/> <polygon  class="bg" stroke-miterlimit="10" points="38.838,41.994 34.55,41.994 34.55,43.111 32.934,41.461 34.55,39.814 34.55,40.932 38.838,40.932 "/> <polygon  class="bg" stroke-miterlimit="10" points="41.263,38.484 41.263,34.156 40.153,34.156 41.787,32.52 43.418,34.156 42.314,34.156 42.314,38.484 "/> <polygon  class="bg" stroke-miterlimit="10" points="41.263,44.314 41.263,48.645 40.153,48.645 41.787,50.277 43.418,48.645 42.314,48.645 42.314,44.314 "/> <polygon  class="bg" stroke-miterlimit="10" points="44.735,40.932 49.023,40.932 49.023,39.814 50.642,41.461 49.023,43.111 49.023,41.994 44.735,41.994 "/> <path  class="bg" d="M48.685,34.514c-0.805-0.861-4.502,1.498-8.255,5.266 c-3.756,3.766-6.146,7.514-5.342,8.373c0.806,0.859,4.503-1.5,8.258-5.266C47.099,39.121,49.49,35.369,48.685,34.514z M48.471,48.219c0.851-0.812-1.485-4.547-5.217-8.338c-3.729-3.791-7.442-6.205-8.292-5.395c-0.849,0.815,1.486,4.549,5.217,8.34 C43.908,46.617,47.619,49.031,48.471,48.219z"/> <path class="white" fill="#FFFFFF" stroke="#FFFFFF" stroke-miterlimit="10" d="M43.547,38.945c1.414,1.004,1.759,2.973,0.767,4.4 c-0.991,1.434-2.941,1.777-4.358,0.777c-1.416-1-1.759-2.971-0.769-4.398C40.179,38.291,42.13,37.945,43.547,38.945"/></g><g id="Layer_4"></g><g id="Layer_5"></g><g id="Layer_6"></g><g id="Layer_7"></g><g id="Layer_8"></g><g id="Layer_3"></g></svg>'
        },
        pc: {
            width: 40,
            height: 40,
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" ' + LINK + ' x="0px" y="0px" width="63.196px" height="49.335px" viewBox="0 0 63.196 49.335" enable-background="new 0 0 63.196 49.335" xml:space="preserve"><g id="Layer_1"></g><g id="Layer_2"></g><g id="Layer_4"></g><g id="Layer_5"> <path  class="bg" d="M63.196,40.307c0,1.077-0.874,1.951-1.95,1.951H1.95c-1.077,0-1.95-0.874-1.95-1.951V1.95 C0,0.873,0.873,0,1.95,0h59.296c1.076,0,1.95,0.873,1.95,1.95V40.307z"/> <rect x="5.673" y="5.265" fill="#E9FBFF" width="51.85" height="31.921"/> <polygon  class="bg" points="31.599,39.698 40.659,48.76 22.536,48.76 "/></g><g id="Layer_6"></g><g id="Layer_7"></g><g id="Layer_8"></g><g id="Layer_3"></g></svg>'

        },
        phone: {
            width: 40,
            height: 40,
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" ' + LINK + ' x="0px" y="0px" width="51.573px" height="46.913px" viewBox="0 0 51.573 46.913" enable-background="new 0 0 51.573 46.913" xml:space="preserve"><g id="Layer_1"></g><g id="Layer_2"></g><g id="Layer_4"></g><g id="Layer_5"> <polygon  class="bg" stroke-miterlimit="10" points="17.233,0.5 17.044,0.5 0.5,0.5 0.5,46.413 17.044,46.413 17.233,46.413 51.073,46.413 51.073,0.5 "/> <rect x="20.694" y="6.43" fill="#E9FBFF" width="24.632" height="18.019"/> <path fill="#EEFDFF" d="M6.843,7.904c0.201-0.874,0.822-1.74,4.668-1.74c4.392,0,4.735,0.87,5.08,1.74 c0.342,0.871-0.962,13.912-0.962,15.933c0,2.019,1.269,16.252,0.479,17.021c-0.788,0.77-0.822,1.071-4.392,1.071 c-3.848,0-4.154-0.368-4.874-1.071C6.12,40.154,7.528,27.125,7.528,23.837C7.528,21.816,6.578,9.043,6.843,7.904z"/> <rect x="29.743" y="28.376" class="white" fill="#FFFFFF" width="14.521" height="1.86"/> <rect x="29.743" y="34.223" class="white" fill="#FFFFFF" width="14.521" height="1.86"/> <rect x="29.743" y="40.068" class="white" fill="#FFFFFF" width="14.521" height="1.86"/> <rect x="22.446" y="34.754" class="white" fill="#FFFFFF" width="5.502" height="1.86"/> <rect x="22.446" y="40.068" class="white" fill="#FFFFFF" width="5.502" height="1.86"/></g><g id="Layer_6"></g><g id="Layer_7"></g><g id="Layer_8"></g><g id="Layer_3"></g></svg>'

        },
        servicerouter: {
            width: 36,
            height: 36,
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" ' + LINK + ' x="0px" y="0px" width="52.921px" height="54.799px" viewBox="0 0 52.921 54.799" enable-background="new 0 0 52.921 54.799" xml:space="preserve"><symbol id="Arrow_25" viewBox="-22.86 -13.14 45.721 26.279"> <polygon fill="none" points="-22.86,-13.14 22.86,-13.14 22.86,13.14 -22.86,13.14 "/> <g> <polygon class="white" fill="#FFFFFF" points="-20.298,-2.933 5.125,-2.933 5.125,-9.242 14.827,0.001 5.125,9.242 5.125,2.934 -20.298,2.934 "/> </g></symbol><g id="Layer_5"> <circle  class="bg" stroke-miterlimit="10" cx="24.528" cy="24.529" r="24.028" /><use xlink:href="#Arrow_25" width="45.721" height="26.279" id="XMLID_24_" x="-22.86" y="-13.14" transform="matrix(0.3786 0.4514 0.4514 -0.3786 16.9238 15.291)" overflow="visible"/><use xlink:href="#Arrow_25" width="45.721" height="26.279" id="XMLID_23_" x="-22.86" y="-13.14" transform="matrix(0.4858 -0.3334 -0.3334 -0.4858 36.4551 15.4097)" overflow="visible"/><use xlink:href="#Arrow_25" width="45.721" height="26.279" id="XMLID_22_" x="-22.86" y="-13.14" transform="matrix(-0.3602 -0.4661 -0.4661 0.3602 31.8154 34.1582)" overflow="visible"/><use xlink:href="#Arrow_25" width="45.721" height="26.279" id="XMLID_21_" x="-22.86" y="-13.14" transform="matrix(-0.4661 0.3602 0.3602 0.4661 13.2129 33.3477)" overflow="visible"/></g><g id="Layer_6"> <rect x="32.764" y="34.643" fill="#FFFFFF"  class="white stroke" stroke-miterlimit="10" width="20.157" height="20.156"/> <rect x="35.821" y="40.281" fill-rule="evenodd" clip-rule="evenodd" fill="#2FBFE9" width="5.501" height="8.723"/> <rect x="44.518" y="40.281" fill-rule="evenodd" clip-rule="evenodd"  class="bg" width="5.501" height="8.723"/> <rect x="35.666" y="40.281"  class="bg" width="5.501" height="8.723"/> <rect x="34.908" y="50.922" fill-rule="evenodd" clip-rule="evenodd"  class="bg" width="15.989" height="1.445"/> <rect x="34.848" y="37.287" fill-rule="evenodd" clip-rule="evenodd"  class="bg" width="15.989" height="1.445"/></g><g id="Layer_7"></g><g id="Layer_8"></g><g id="Layer_3"></g></svg>'

        },
        tablet: {
            width: 40,
            height: 40,
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" ' + LINK + ' x="0px" y="0px" width="37.605px" height="49.581px" viewBox="0 0 37.605 49.581" enable-background="new 0 0 37.605 49.581" xml:space="preserve"><g id="Layer_5"> <g> <g><path  class="bg" d="M1.939,49.581C0.869,49.581,0,48.713,0,47.646V1.936C0,0.867,0.869,0,1.939,0h33.729 c1.067,0,1.937,0.867,1.937,1.936v45.71c0,1.067-0.869,1.936-1.937,1.936H1.939z"/><rect x="3.862" y="5.431" fill="#E9FBFF" width="29.884" height="37.841"/><g> <g> <circle fill="#FCFCFC" stroke="#F9F9F9" stroke-miterlimit="10" cx="18.847" cy="46.486" r="1.152"/> </g></g> </g> </g></g></svg>'
        },
        server: {
            width: 40,
            height: 40,
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" ' + LINK + ' x="0px" y="0px" width="32.628px" height="50.34px" viewBox="0 0 32.628 50.34" enable-background="new 0 0 32.628 50.34" xml:space="preserve"><g id="Layer_7"> <g> <rect  class="bg" width="32.628" height="50.34"/> <rect x="4.839" y="11.783" class="white" fill="#FFFFFF" width="22.952" height="1.513"/> <rect x="4.839" y="6.085" class="white" fill="#FFFFFF" width="22.952" height="1.512"/> <rect x="4.839" y="17.481" class="white" fill="#FFFFFF" width="22.952" height="1.513"/> <rect x="4.839" y="23.178" class="white" fill="#FFFFFF" width="22.952" height="1.513"/> <rect x="23.127" y="28.367" class="white" fill="#FFFFFF" width="2.914" height="1.513"/> <rect x="18.805" y="28.367" class="white" fill="#FFFFFF" width="2.911" height="1.513"/> <rect x="6.72" y="37.167" class="white" fill="#FFFFFF" width="1.224" height="3.566"/> <rect x="10.209" y="37.167" class="white" fill="#FFFFFF" width="1.225" height="3.566"/> <rect x="13.699" y="37.167" class="white" fill="#FFFFFF" width="1.223" height="3.566"/> <rect x="17.188" y="37.167" class="white" fill="#FFFFFF" width="1.224" height="3.566"/> <rect x="20.675" y="37.167" class="white" fill="#FFFFFF" width="1.227" height="3.566"/> <rect x="24.166" y="37.167" class="white" fill="#FFFFFF" width="1.225" height="3.566"/> </g></g><g id="Layer_8"></g><g id="Layer_3"></g></svg>'
        },
        voiceenabledrouter: {
            width: 36,
            height: 36,
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" ' + LINK + ' x="0px" y="0px" width="53.252px" height="55.426px" viewBox="0 0 53.252 55.426" enable-background="new 0 0 53.252 55.426" xml:space="preserve"><g id="Layer_5"> <g> <g><g> <polyline class="white" fill="#FFFFFF" points="25.022,19.064 25.022,9.343 26.671,9.343 24.24,5.674 21.807,9.343 23.456,9.343 23.456,19.064 25.022,19.064 "/></g><g> <polyline class="white" fill="#FFFFFF" points="20.063,20.469 13.193,13.596 14.357,12.429 10.044,11.555 10.917,15.87 12.082,14.706 18.954,21.576 20.063,20.469 "/></g><g> <polyline class="white" fill="#FFFFFF" points="17.549,24.973 7.83,24.973 7.83,23.318 4.159,25.751 7.83,28.185 7.83,26.535 17.549,26.535 17.549,24.973 "/></g><g> <polyline class="white" fill="#FFFFFF" points="18.954,29.928 12.082,36.801 10.917,35.635 10.044,39.951 14.357,39.078 13.193,37.908 20.063,31.036 18.954,29.928 "/></g><g> <polyline class="white" fill="#FFFFFF" points="23.456,32.439 23.456,42.162 21.807,42.162 24.24,45.83 26.671,42.162 25.022,42.162 25.022,32.439 23.456,32.439 "/></g><g> <polyline class="white" fill="#FFFFFF" points="28.413,31.036 35.286,37.908 34.124,39.078 38.438,39.951 37.564,35.635 36.399,36.801 29.525,29.928 28.413,31.036 "/></g><g> <polyline class="white" fill="#FFFFFF" points="30.931,26.535 40.649,26.535 40.649,28.185 44.32,25.751 40.649,23.318 40.649,24.973 30.931,24.973 30.931,26.535 "/></g><g> <polyline class="white" fill="#FFFFFF" points="29.525,21.576 36.399,14.706 37.564,15.87 38.438,11.555 34.124,12.429 35.286,13.596 28.413,20.469 29.525,21.576 "/></g><g> <path class="white" fill="#FFFFFF" d="M30.812,35.769c5.366-3.756,6.672-11.15,2.912-16.514c-3.754-5.367-11.15-6.669-16.513-2.912 c-5.362,3.756-6.669,11.15-2.913,16.517C18.053,38.22,25.447,39.523,30.812,35.769z"/> <path fill="#32B6E9" d="M24.021,38.395C24.021,38.395,24.021,38.395,24.021,38.395c-4.029,0-7.812-1.966-10.118-5.259 c-3.9-5.574-2.541-13.284,3.031-17.187c2.086-1.461,4.529-2.234,7.067-2.234c4.029,0,7.811,1.968,10.116,5.264 c1.892,2.699,2.618,5.973,2.046,9.219c-0.573,3.246-2.376,6.074-5.076,7.965C29.002,37.623,26.559,38.395,24.021,38.395z M24.002,14.677c-2.339,0-4.592,0.712-6.515,2.06c-5.138,3.599-6.392,10.708-2.795,15.846c2.126,3.036,5.613,4.849,9.328,4.849 c0,0,0,0,0.001,0c2.339,0,4.591-0.711,6.514-2.058c2.49-1.742,4.152-4.351,4.681-7.343c0.528-2.993-0.142-6.012-1.887-8.5 C31.204,16.492,27.717,14.677,24.002,14.677z"/></g> </g> </g> <g> <circle  class="bg" cx="24.529" cy="24.529" r="24.029"/> <path  class="bg" d="M24.529,49.057C11.004,49.057,0,38.054,0,24.529C0,11.004,11.004,0,24.529,0s24.528,11.004,24.528,24.529C49.058,38.054,38.055,49.057,24.529,49.057z M24.529,1C11.556,1,1,11.555,1,24.529c0,12.973,10.556,23.527,23.529,23.527s23.528-10.555,23.528-23.527C48.058,11.555,37.503,1,24.529,1z"/> </g> <g id="Arrow_25_7_"> <rect x="4.038" y="8.017" transform="matrix(-0.6426 -0.7662 0.7662 -0.6426 16.2376 38.6659)" fill="none" width="26.197" height="15.058"/> <g><polygon class="white" fill="#FFFFFF" points="8.376,7.715 17.736,18.875 14.967,21.199 22.597,22.055 23.081,14.393 20.312,16.716 10.951,5.555 "/> </g> </g> <g id="Arrow_25_6_"> <rect x="23.029" y="8.131" transform="matrix(-0.8245 0.5658 -0.5658 -0.8245 74.775 8.1289)" fill="none" width="26.196" height="15.057"/> <g><polygon class="white" fill="#FFFFFF" points="27.489,23.626 39.499,15.383 41.544,18.364 43.131,10.852 35.552,9.632 37.597,12.612 25.587,20.854 "/> </g> </g> <g id="Arrow_25_5_"> <rect x="18.521" y="26.364" transform="matrix(0.6115 0.7912 -0.7912 0.6115 39.0956 -11.8493)" fill="none" width="26.189" height="15.053"/> <g><polygon class="white" fill="#FFFFFF" points="40.055,42.062 31.149,30.541 34.009,28.33 26.421,27.171 25.632,34.806 28.49,32.596 37.396,44.117 "/> </g> </g> <g id="Arrow_25_4_"> <rect x="0.433" y="25.577" transform="matrix(0.7912 -0.6115 0.6115 0.7912 -17.42 15.1844)" fill="none" width="26.189" height="15.053"/> <g><polygon class="white" fill="#FFFFFF" points="21.699,24.664 10.178,33.569 7.967,30.71 6.808,38.298 14.442,39.087 12.232,36.229 23.754,27.322 "/> </g> </g> <g> <circle class="white" fill="#FFFFFF" cx="42.666" cy="44.138" r="10.586"/> <path  class="bg" d="M42.666,55.225c-6.113,0-11.086-4.974-11.086-11.087s4.973-11.086,11.086-11.086s11.086,4.973,11.086,11.086S48.779,55.225,42.666,55.225z M42.666,34.052c-5.562,0-10.086,4.524-10.086,10.086s4.524,10.087,10.086,10.087s10.086-4.525,10.086-10.087S48.228,34.052,42.666,34.052z"/> </g> <g> <path  class="bg" d="M36.381,39.281h3.862l2.691,8.605l2.656-8.605h3.75l-4.439,11.957h-4.005L36.381,39.281z"/> </g></g></svg>'

        },
        openflow: {
            width: 42,
            height: 42,
            icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="54px" height="54px" viewBox="0 0 54 54" enable-background="new 0 0 54 54" xml:space="preserve"><rect y="0"  class="bg" width="47.693" height="47.693"/><g> <g> <path class="white" fill="#FFFFFF" d="M30.713,34.846l-2.309-4.256l-0.821,2.213c-0.526-0.268-1.546-0.955-2.239-2.042 c-0.896-1.407-1.219-3.474-0.916-5.002c0.334-1.341,1.414-2.732,2.602-3.623c1.499-1.13,4.131-1.503,6.456-1.675 c0-0.011-5.394,1.268-6.56,3.882c-0.756,1.696-0.781,3.396,0.498,5.317c4.047-1.395,4.85-2.511,6.604-8.958 c0.157-0.578,0.196-1.31,0.108-1.902c-3.271-0.465-7.029-0.848-10.078,0.718c-0.871,0.446-1.788,1.03-2.514,1.69 c-3.277,2.987-4.646,7.888-2.177,11.799c1.418,2.244,3.659,3.818,5.778,5.345c0.089,0.065-0.547,1.851-0.613,2.077l2.02-0.881 l5.617-2.54L30.713,34.846z"/> </g> <g> <path class="white" fill="#FFFFFF" d="M16.722,21.586c-0.563-1.342-0.744-2.97-0.413-4.641c0.739-3.744,3.756-6.314,6.722-5.728 c2.311,0.458,3.912,2.699,4.162,5.436c2.355,0.122,4.728,0.836,6.926,1.62c0.373-6.672-3.673-12.654-9.743-13.854 C17.661,3.092,10.991,8.107,9.508,15.6c-1.143,5.779,1.136,11.355,5.313,14.221C14.142,26.871,14.972,23.938,16.722,21.586z"/> </g></g><g> <g> <rect x="32.495" y="32.574" class="white" fill="#FFFFFF" width="20.423" height="20.426"/> <rect x="32.495" y="32.574" fill="none"  class="stroke" stroke-miterlimit="10" width="20.423" height="20.426"/> </g></g><g id="Arrow_25_11_"> <g> <polygon  class="bg" points="42.172,40.309 42.176,41.854 48.885,41.834 48.893,43.5 51.445,41.054 48.879,38.617 48.881,40.287 "/> <polygon  class="bg" points="48.881,48.621 42.172,48.64 42.176,50.188 48.885,50.168 48.893,51.832 51.445,49.387 48.879,46.949 "/> <polygon  class="bg" points="43.575,44.472 36.866,44.451 36.87,42.785 34.301,45.219 36.854,47.67 36.862,45.998 43.573,46.024 "/> <polygon  class="bg" points="36.862,37.668 43.573,37.691 43.575,36.139 36.866,36.119 36.87,34.453 34.301,36.886 36.854,39.336 "/> </g></g></svg>'
        },
        wlc: {
            width: 36,
            height: 36,
            icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="60.975px" height="61.136px" viewBox="0 0 60.975 61.136" enable-background="new 0 0 60.975 61.136" xml:space="preserve"><symbol id="Arrow_25" viewBox="-22.86 -13.14 45.721 26.279"> <polygon fill="none" points="-22.86,-13.14 22.86,-13.14 22.86,13.14 -22.86,13.14 "/> <g> <polygon class="white" fill="#FFFFFF" points="-20.298,-2.933 5.125,-2.933 5.125,-9.242 14.827,0.001 5.125,9.242 5.125,2.934 -20.298,2.934 "/> </g></symbol><g> <rect  class="bg" width="54.824" height="54.822" /> <g> <g> <use xlink:href="#Arrow_25" width="45.721" height="26.279" x="-22.86" y="-13.14" transform="matrix(-2.160127e-08 -0.4942 -0.4942 2.160127e-08 27.4116 39.3906)" overflow="visible"/> <use xlink:href="#Arrow_25" width="45.721" height="26.279" x="-22.86" y="-13.14" transform="matrix(-0.3494 -0.3494 -0.3494 0.3494 42.917 39.3906)" overflow="visible"/> <use xlink:href="#Arrow_25" width="45.721" height="26.279" x="-22.86" y="-13.14" transform="matrix(0.3494 -0.3494 -0.3494 -0.3494 11.9067 39.3906)" overflow="visible"/> </g> <use xlink:href="#Arrow_25" width="45.721" height="26.279" id="XMLID_126_" x="-22.86" y="-13.14" transform="matrix(-0.0022 -0.7161 -0.7161 0.0022 27.4121 14.0898)" overflow="visible"/> </g> <g> <rect x="36.978" y="37.104" class="white" fill="#FFFFFF" width="23.505" height="23.507"/> <rect x="36.978" y="37.104" fill="none"  class="stroke" stroke-miterlimit="10" width="23.505" height="23.507"/> </g> <g> <g> <path  class="bg" d="M46.42,52.356c-0.896,0-1.713-1.123-2.498-3.43c-0.893-2.619-1.657-3.178-2.147-3.178 c-0.006,0-0.012,0.002-0.017,0.002c-0.996,0.024-1.852,2.278-2.097,3.143c-0.028,0.102-0.134,0.158-0.232,0.131 c-0.101-0.029-0.158-0.132-0.13-0.232c0.098-0.346,0.998-3.381,2.449-3.419c0.906-0.015,1.735,1.1,2.529,3.433 c0.891,2.614,1.654,3.173,2.145,3.173c0.006,0,0.012,0,0.017,0c0.999-0.027,1.853-2.284,2.099-3.152 c0.098-0.351,1.004-3.427,2.459-3.468c0.01,0,0.02,0,0.029,0c0.893,0,1.706,1.117,2.486,3.412 c0.892,2.618,1.658,3.176,2.148,3.176c0.006,0,0.012,0,0.017-0.002c0.999-0.025,1.856-2.28,2.103-3.147 c0.029-0.1,0.133-0.158,0.234-0.129c0.1,0.027,0.157,0.132,0.129,0.231c-0.098,0.346-1.002,3.386-2.456,3.422 c-0.009,0.002-0.019,0.002-0.028,0.002c-0.898,0-1.717-1.123-2.502-3.431c-0.896-2.634-1.676-3.161-2.149-3.157 c-1.001,0.027-1.86,2.314-2.106,3.193c-0.1,0.348-1,3.387-2.452,3.426C46.439,52.356,46.43,52.356,46.42,52.356z"/> </g> <g> <path  class="bg" d="M41.785,52.732c-0.013,0-0.025,0-0.039-0.001c-1.688-0.045-2.635-3.083-2.809-3.69 c-0.085-0.301,0.089-0.612,0.389-0.698c0.301-0.088,0.613,0.088,0.698,0.389c0.341,1.193,1.138,2.855,1.751,2.872 c0.117,0,0.846-0.121,1.799-2.921c0.855-2.513,1.764-3.686,2.856-3.686c0.014,0,0.026,0,0.04,0.002 c1.688,0.041,2.638,3.086,2.811,3.694c0.341,1.195,1.139,2.859,1.749,2.876c0.001,0,0.005,0,0.006,0 c0.145,0,0.85-0.154,1.79-2.919c0.862-2.532,1.787-3.697,2.884-3.668c1.69,0.047,2.64,3.125,2.812,3.743 c0.085,0.301-0.091,0.612-0.391,0.696c-0.302,0.085-0.612-0.09-0.696-0.391c-0.395-1.398-1.193-2.905-1.757-2.919 c-0.131,0-0.837,0.118-1.782,2.901c-0.865,2.543-1.784,3.731-2.895,3.685c-1.687-0.043-2.635-3.086-2.807-3.696 c-0.342-1.194-1.141-2.86-1.754-2.874c-0.129-0.016-0.846,0.122-1.797,2.917C43.789,51.559,42.879,52.732,41.785,52.732z"/> </g> </g></g></svg>'
        },
        unknown: {
            width: 36,
            height: 36,
            icon: '<svg version="1.1" id="Layer_1" ' + XMLNS + ' ' + LINK + ' x="0px" y="0px" width="100px" height="100px" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"><g id="Layer_3"> <g> <path  class="bg" d="M100,49.512c0,27.339-22.167,49.509-49.505,49.509c-27.346,0-49.516-22.17-49.516-49.509 C0.979,22.167,23.149,0,50.495,0C77.833,0,100,22.167,100,49.512z"/> <g opacity="0.3"> <polygon class="white" fill="#FFFFFF" points="17.765,14.889 37.046,37.879 31.341,42.664 47.058,44.429 48.056,28.645 42.352,33.432 23.069,10.438 "/> </g> <g opacity="0.3"> <polygon class="white" fill="#FFFFFF" points="83.036,85.662 64.688,61.919 70.58,57.366 54.945,54.977 53.316,70.707 59.208,66.152 77.557,89.896 "/> </g> <polygon opacity="0.3" class="white" fill="#FFFFFF" enable-background="new " points="49.449,55.289 45.215,49.812 21.472,68.158 16.918,62.268 14.527,77.9 30.258,79.529 25.706,73.639 "/> <polygon opacity="0.3" class="white" fill="#FFFFFF" enable-background="new " points="57.588,49.243 82.334,32.259 86.549,38.401 89.816,22.922 74.2,20.41 78.415,26.55 53.669,43.531 "/> </g></g><g enable-background="new "> <g> <path fill="#FCFAFA" d="M44.412,85.58l-0.125-0.125V74.537l0.125-0.125h10.824l0.125,0.125v10.918l-0.125,0.125H44.412z M45.165,65.911l-0.125-0.125c0-10.896,2.82-16.03,11.174-20.347c5.347-2.718,7.837-6.421,7.837-11.654 c0-5.756-4.938-9.475-12.58-9.475c-8.323,0-13.062,3.637-14.087,10.81l-0.124,0.107h-9.788l-0.124-0.144 c1.864-12.029,10.759-18.928,24.404-18.928c12.888,0,22.242,7.415,22.242,17.631c0,8.173-4.417,14.428-13.899,19.685 c-4.495,2.47-5.865,5.347-5.865,12.315l-0.125,0.125H45.165z"/> <path  class="bg" d="M51.753,16.28c13.554,0,22.117,7.906,22.117,17.506c0,8-4.329,14.306-13.835,19.575 c-4.801,2.638-5.93,5.836-5.93,12.425h-8.94v-0.001c0-10.824,2.729-15.906,11.106-20.235c5.74-2.918,7.904-6.776,7.904-11.765 c0-5.741-4.988-9.6-12.705-9.6c-8.282,0-13.176,3.67-14.211,10.917h-9.788C29.353,22.962,38.482,16.28,51.753,16.28 M55.236,74.537v10.918H44.412V74.537H55.236 M51.753,16.03c-13.714,0-22.654,6.938-24.528,19.034l0.247,0.288h9.788l0.248-0.215 c1.014-7.102,5.712-10.702,13.963-10.702c7.566,0,12.455,3.67,12.455,9.35c0,5.251-2.396,8.811-7.768,11.542 c-8.406,4.344-11.243,9.506-11.243,20.458l0.25,0.25l8.94,0.001l0.25-0.25c0-6.912,1.355-9.764,5.8-12.206 c9.527-5.281,13.965-11.571,13.965-19.794C74.12,23.498,64.713,16.03,51.753,16.03L51.753,16.03z M55.236,74.287H44.412 l-0.25,0.25v10.918l0.25,0.25h10.824l0.25-0.25V74.537L55.236,74.287L55.236,74.287z"/> </g></g></svg>'
        },
        cloud: {
            width: 96,
            height: 58,
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 111.128 79.276"><g id="Layer_4" transform="matrix(0.89840137,0,0,-0.80074289,45.77195,41.33252)"> <path d="m 56.93,14.529 c 0.609,2.337 0.936,4.785 0.936,7.312 0,15.934 -12.917,28.853 -28.853,28.853 -11.98,0 -22.257,-7.305 -26.618,-17.702 -3.746,4.402 -9.323,7.199 -15.557,7.199 -11.28,0 -20.424,-9.144 -20.424,-20.424 0,-1.939 0.276,-3.814 0.781,-5.59 -9.212,-3.379 -15.776,-12.223 -15.776,-22.609 0,-13.285 10.765,-24.072 24.065,-24.072 H 49.68 c 13.307,0 24.072,10.787 24.072,24.072 0.001,10.774 -7.064,19.889 -16.822,22.961 z" id="path5" fill="#d0d2d3"/></g></svg>'
        },
        collapse: {
            width: 16,
            height: 16,
            icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="58.406px" height="51.48px" viewBox="0 0 58.406 51.48" enable-background="new 0 0 58.406 51.48" xml:space="preserve"><g> <path  class="bg" d="M29.207,0.623c-13.873,0-25.125,11.252-25.125,25.117c0,13.873,11.252,25.117,25.125,25.117 c13.872,0,25.117-11.244,25.117-25.117C54.324,11.875,43.079,0.623,29.207,0.623z"/> <path class="white" fill="#FFFFFF" d="M29.207,45.15c-10.705,0-19.417-8.706-19.417-19.41S18.502,6.33,29.207,6.33 c10.696,0,19.409,8.706,19.409,19.41S39.903,45.15,29.207,45.15z"/> <g> <rect x="14.616" y="22.823" fill-rule="evenodd" clip-rule="evenodd"  class="bg" width="29.174" height="5.833"/> </g></g></svg>'
        },
        expand: {
            width: 16,
            height: 16,
            icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="58.406px" height="51.48px" viewBox="0 0 58.406 51.48" enable-background="new 0 0 58.406 51.48" xml:space="preserve"><g> <path  class="bg" d="M29.205,0.874c-13.734,0-24.875,11.14-24.875,24.867c0,13.735,11.141,24.867,24.875,24.867 c13.732,0,24.873-11.132,24.873-24.867C54.078,12.014,42.938,0.874,29.205,0.874z"/> <path class="white" fill="#FFFFFF" d="M29.205,44.958c-10.598,0-19.221-8.619-19.221-19.216c0-10.598,8.623-19.217,19.221-19.217 c10.588,0,19.215,8.619,19.215,19.217C48.42,36.339,39.793,44.958,29.205,44.958z"/> <g> <rect x="26.31" y="11.303" fill-rule="evenodd" clip-rule="evenodd"  class="bg" width="5.781" height="28.884"/> <rect x="14.76" y="22.854" fill-rule="evenodd" clip-rule="evenodd"  class="bg" width="28.881" height="5.775"/> </g></g></svg>'
        },
        arrow: {
            width: 16,
            height: 16,
            icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="58.406px" height="51.48px" viewBox="0 0 58.406 51.48" enable-background="new 0 0 58.406 51.48" xml:space="preserve"><polyline  class="bg" points="22.728,50.445 48.713,26.091 22.728,1.034 9.694,1.034 35.681,25.705 9.694,50.445 22.728,50.445 "/></svg>'
        },
        groupL: {
            width: 36,
            height: 36,
            icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="58.406px" height="51.48px" viewBox="0 0 58.406 51.48" enable-background="new 0 0 58.406 51.48" xml:space="preserve"><g> <path  class="bg" d="M14.902,9.533V5.72h-5.72v3.813H7.276V51.48h9.534V9.533H14.902z M11.089,47.667H9.183V45.76h1.907V47.667z M11.089,43.853H9.183v-1.906h1.907V43.853z M11.089,40.04H9.183v-1.906h1.907V40.04z M11.089,36.226H9.183V34.32h1.907V36.226z M11.089,32.414H9.183v-1.907h1.907V32.414z M11.089,28.6H9.183v-1.907h1.907V28.6z M11.089,24.787H9.183V22.88h1.907V24.787z M11.089,20.973H9.183v-1.907h1.907V20.973z M11.089,17.16H9.183v-1.907h1.907V17.16z M14.902,47.667h-1.906V45.76h1.906V47.667z M14.902,43.853h-1.906v-1.906h1.906V43.853z M14.902,40.04h-1.906v-1.906h1.906V40.04z M14.902,36.226h-1.906V34.32h1.906V36.226z M14.902,32.414h-1.906v-1.907h1.906V32.414z M14.902,28.6h-1.906v-1.907h1.906V28.6z M14.902,24.787h-1.906V22.88h1.906V24.787z M14.902,20.973h-1.906v-1.907h1.906V20.973z M14.902,17.16h-1.906v-1.907h1.906V17.16z"/> <path  class="bg" d="M30.156,5.72v45.76h9.533V0L30.156,5.72z M33.97,47.667h-1.907V45.76h1.907V47.667z M33.97,43.853h-1.907 v-1.906h1.907V43.853z M33.97,40.04h-1.907v-1.906h1.907V40.04z M33.97,36.226h-1.907V34.32h1.907V36.226z M33.97,32.414h-1.907 v-1.907h1.907V32.414z M33.97,28.6h-1.907v-1.907h1.907V28.6z M33.97,24.787h-1.907V22.88h1.907V24.787z M33.97,20.973h-1.907 v-1.907h1.907V20.973z M33.97,17.16h-1.907v-1.907h1.907V17.16z M33.97,13.346h-1.907V11.44h1.907V13.346z M33.97,9.533h-1.907 V7.627h1.907V9.533z M37.783,47.667h-1.907V45.76h1.907V47.667z M37.783,43.853h-1.907v-1.906h1.907V43.853z M37.783,40.04h-1.907 v-1.906h1.907V40.04z M37.783,36.226h-1.907V34.32h1.907V36.226z M37.783,32.414h-1.907v-1.907h1.907V32.414z M37.783,28.6h-1.907 v-1.907h1.907V28.6z M37.783,24.787h-1.907V22.88h1.907V24.787z M37.783,20.973h-1.907v-1.907h1.907V20.973z M37.783,17.16h-1.907 v-1.907h1.907V17.16z M37.783,13.346h-1.907V11.44h1.907V13.346z M37.783,9.533h-1.907V7.627h1.907V9.533z"/> <path  class="bg" d="M18.716,15.253V51.48h9.534V15.253H18.716z M22.529,45.76h-1.907v-1.907h1.907V45.76z M22.529,41.947 h-1.907V40.04h1.907V41.947z M22.529,38.134h-1.907v-1.907h1.907V38.134z M22.529,34.32h-1.907v-1.906h1.907V34.32z M22.529,30.507 h-1.907V28.6h1.907V30.507z M22.529,26.693h-1.907v-1.906h1.907V26.693z M22.529,22.88h-1.907v-1.907h1.907V22.88z M22.529,19.067 h-1.907V17.16h1.907V19.067z M26.343,45.76h-1.907v-1.907h1.907V45.76z M26.343,41.947h-1.907V40.04h1.907V41.947z M26.343,38.134 h-1.907v-1.907h1.907V38.134z M26.343,34.32h-1.907v-1.906h1.907V34.32z M26.343,30.507h-1.907V28.6h1.907V30.507z M26.343,26.693 h-1.907v-1.906h1.907V26.693z M26.343,22.88h-1.907v-1.907h1.907V22.88z M26.343,19.067h-1.907V17.16h1.907V19.067z"/> <path  class="bg" d="M49.223,19.067V17.16h-1.906v1.907h-1.907V17.16h-1.906v1.907h-1.907V51.48h9.534V19.067H49.223z M45.409,45.76h-1.906v-1.907h1.906V45.76z M45.409,41.947h-1.906V40.04h1.906V41.947z M45.409,38.134h-1.906v-1.907h1.906V38.134z M45.409,34.32h-1.906v-1.906h1.906V34.32z M45.409,30.507h-1.906V28.6h1.906V30.507z M45.409,26.693h-1.906v-1.906h1.906V26.693z M45.409,22.88h-1.906v-1.907h1.906V22.88z M49.223,45.76h-1.906v-1.907h1.906V45.76z M49.223,41.947h-1.906V40.04h1.906V41.947z M49.223,38.134h-1.906v-1.907h1.906V38.134z M49.223,34.32h-1.906v-1.906h1.906V34.32z M49.223,30.507h-1.906V28.6h1.906V30.507z M49.223,26.693h-1.906v-1.906h1.906V26.693z M49.223,22.88h-1.906v-1.907h1.906V22.88z"/></g></svg>'
        },
        groupM: {
            width: 36,
            height: 36,
            icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="58.406px" height="51.48px" viewBox="0 0 58.406 51.48" enable-background="new 0 0 58.406 51.48" xml:space="preserve"><path  class="bg" d="M14.188,0v51.48h10.725V42.9h8.58v8.58h10.726V0H14.188z M27.058,4.29h4.29v6.435h-4.29V4.29z M27.058,12.87 h4.29v6.435h-4.29V12.87z M27.058,21.45h4.29v6.435h-4.29V21.45z M27.058,30.03h4.29v6.435h-4.29V30.03z M18.478,4.29h4.29v6.435 h-4.29V4.29z M18.478,12.87h4.29v6.435h-4.29V12.87z M18.478,21.45h4.29v6.435h-4.29V21.45z M18.478,30.03h4.29v6.435h-4.29V30.03z M39.928,36.465h-4.289V30.03h4.289V36.465z M39.928,27.885h-4.289V21.45h4.289V27.885z M39.928,19.305h-4.289V12.87h4.289V19.305z M39.928,10.725h-4.289V4.29h4.289V10.725z"/></svg>'
        },
        groupS: {
            width: 36,
            height: 36,
            icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="58.406px" height="51.48px" viewBox="0 0 58.406 51.48" enable-background="new 0 0 58.406 51.48" xml:space="preserve"><g> <polygon  class="bg" points="47.923,18.72 47.923,2.341 38.563,2.341 38.563,9.361 29.198,0 3.463,25.74 8.138,25.74 8.138,51.481 22.183,51.481 22.183,32.76 36.223,32.76 36.223,51.481 50.264,51.481 50.264,25.74 54.943,25.74 "/></g></svg>'
        },
        hierarchy: {
            width: 36,
            height: 36,
            icon: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="58.406px" height="51.48px" viewBox="0 0 58.406 51.48" enable-background="new 0 0 58.406 51.48" xml:space="preserve"><g> <g> <path  class="bg" d="M37.631,23.454H21.145V6.972h16.486V23.454z M23.486,21.113h11.805v-11.8H23.486V21.113z"/> </g> <g> <path  class="bg" d="M37.631,44.508H21.145V28.026h16.486V44.508z M23.486,42.167h11.805v-11.8H23.486V42.167z"/> </g> <g> <path  class="bg" d="M57.949,44.508H41.467V28.026h16.482V44.508z M43.808,42.167h11.801v-11.8H43.808V42.167z"/> </g> <g> <path  class="bg" d="M16.939,44.508H0.458V28.026h16.481V44.508z M2.798,42.167h11.8v-11.8h-11.8V42.167z"/> </g> <g> <polygon  class="bg" points="50.881,36.264 48.54,36.264 48.54,16.386 9.866,16.386 9.866,36.264 7.525,36.264 7.525,14.045 50.881,14.045 "/> </g> <g> <rect x="28.218" y="15.216"  class="bg" width="2.341" height="21.049"/> </g></g></svg>'
        }

    };


    nx.each(topology_icon, function (icon, key) {
        ICONS.icons[key] = {
            icon: new DOMParser().parseFromString(icon.icon, "text/xml").documentElement.cloneNode(true),
            size: {width: icon.width, height: icon.height},
            name: key
        };
    });

})(nx, nx.util, nx.global);
