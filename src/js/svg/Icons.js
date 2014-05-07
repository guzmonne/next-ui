(function (nx, global) {
    var xlink = 'http://www.w3.org/1999/xlink';
    /**
     * Topology device icons collection
     * @class nx.graphic.Icons
     * @static
     */
    var ICONS = nx.define('nx.graphic.Icons', {
        static: true,
        statics: {
            /**
             * Get icons collection
             * @static
             * @property icons
             */
            icons: {}
        },
        methods: {
            /**
             * Get icon by type
             * @param type {String}
             * @returns {element}
             * @method get
             */
            get: function (type) {
                return ICONS.icons[type] || ICONS.icons.switch;
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
                ICONS.icons[name] = {
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
    //class="bg" class="stroke"
    // class="stroke"


    var topology_icon = {
        switch: {
            width: 36,
            height: 36,
            font: ['\ue60f', '\ue610']
        },
        router: {
            width: 36,
            height: 36,
            font: ['\ue611', '\ue612']
        },
        accesspoint: {
            width: 40,
            height: 40,
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" ' + LINK + ' x="0px" y="0px" width="51.627px" height="41.148px" viewBox="0 0 51.627 41.148" enable-background="new 0 0 51.627 41.148" xml:space="preserve"><g id="Layer_1"></g><g id="Layer_2"></g><g id="Layer_4"></g><g id="Layer_5"></g><g id="Layer_6"></g><g id="Layer_7"></g><g id="Layer_8"> <rect x="0.5" y="0.5"  class="bg" stroke-miterlimit="10" width="50.627" height="40.148" /> <g> <path fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-miterlimit="1" d="M51.588,20.932c0,0-5.796,20.432-12.771-0.044c-6.961-20.475-12.737,0.127-12.737,0.127s-5.781,20.442-12.748-0.034C6.359,0.5,0.582,20.917,0.582,20.917"/> <path fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-miterlimit="1" d="M0.585,21.036c0,0,5.799,20.416,12.774-0.061c6.965-20.476,12.774-0.044,12.774-0.044s5.794,20.432,12.758-0.044c6.968-20.475,12.745,0.127,12.745,0.127"/> </g></g><g id="Layer_3"></g></svg>'
        },
        asr1000series: {
            width: 40,
            height: 40,
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100px" height="93.013px" viewBox="0 0 100 93.013" enable-background="new 0 0 100 93.013" xml:space="preserve"><g id="Layer_3">  <g>  <g>  <g>  <polygon class="bg" points="30.109,93.013 2.865,65.77 2.865,27.242 30.109,0 68.636,0 95.879,27.242 95.879,65.77 68.636,93.013 "/>  </g>  </g>  <g id="XMLID_20_">  <g> <rect x="10.402" y="14.682" transform="matrix(-0.6426 -0.7662 0.7662 -0.6426 35.7615 74.6585)" fill="none" width="49.782" height="28.614"/>  </g>  <g>  <g> <polygon fill="#FFFFFF" points="18.645,14.107 36.433,35.317 31.17,39.732 45.668,41.357 46.589,26.797 41.326,31.213 23.538,10.004 "/>  </g>  </g>  </g>  <g id="XMLID_19_">  <g> <rect x="46.493" y="14.898" transform="matrix(-0.8245 0.5658 -0.5658 -0.8245 146.7636 12.8944)" fill="none" width="49.779" height="28.614"/>  </g>  <g>  <g> <polygon fill="#FFFFFF" points="54.968,44.343 77.79,28.681 81.676,34.347 84.691,20.069 70.289,17.751 74.176,23.416 51.353,39.076 "/>  </g>  </g>  </g>  <g id="XMLID_18_">  <g> <rect x="37.924" y="49.548" transform="matrix(0.6115 0.7912 -0.7912 0.6115 74.9172 -24.8901)" fill="none" width="49.765" height="28.605"/>  </g>  <g>  <g> <polygon fill="#FFFFFF" points="78.845,79.381 61.922,57.486 67.355,53.284 52.936,51.081 51.437,65.59 56.868,61.391 73.793,83.285 "/>  </g>  </g>  </g>  <g id="XMLID_17_">  <g> <rect x="3.55" y="48.051" transform="matrix(0.7912 -0.6116 0.6116 0.7912 -32.1959 30.4087)" fill="none" width="49.767" height="28.604"/>  </g>  <g>  <g> <polygon fill="#FFFFFF" points="43.963,46.315 22.068,63.239 17.867,57.805 15.664,72.224 30.173,73.724 25.973,68.292 47.867,51.367 "/>  </g>  </g>  </g>  <g opacity="0.6">  <g>  <polygon fill="#204B7F" points="30.109,93.013 2.865,65.77 2.865,58.168 95.879,58.499 95.879,65.77 68.636,93.013 "/>  </g>  </g>  <g>  <g>  <path fill="#FAFCFC" d="M40.933,83.226c0.978,0.676,2.042,1.212,3.192,1.61l-1.469,2.713c-0.604-0.172-1.191-0.409-1.764-0.713 c-0.127-0.061-1.012-0.623-2.654-1.688c-1.294,0.547-2.727,0.817-4.297,0.817c-3.035,0-5.412-0.861-7.131-2.583 c-1.721-1.725-2.58-4.146-2.58-7.264c0-3.109,0.861-5.526,2.585-7.255c1.724-1.728,4.064-2.592,7.019-2.592 c2.928,0,5.248,0.864,6.963,2.592c1.715,1.729,2.572,4.146,2.572,7.255c0,1.646-0.237,3.092-0.713,4.339 C42.297,81.41,41.722,82.332,40.933,83.226z M37.727,81.054c0.512-0.578,0.896-1.28,1.151-2.104 c0.256-0.822,0.385-1.766,0.385-2.831c0-2.2-0.503-3.843-1.509-4.93s-2.322-1.629-3.947-1.629c-1.626,0-2.943,0.546-3.953,1.636 c-1.01,1.092-1.514,2.732-1.514,4.923c0,2.227,0.504,3.892,1.514,4.996c1.01,1.103,2.289,1.655,3.832,1.655 c0.573,0,1.117-0.09,1.629-0.272c-0.807-0.512-1.629-0.908-2.463-1.194l1.116-2.197C35.279,79.539,36.532,80.189,37.727,81.054z "/>  </g>  <g>  <path fill="#FAFCFC" d="M46.521,85.643V66.598h13.537v3.222h-9.551v4.506h8.244v3.221h-8.244v8.097H46.521z"/>  </g>  <g>  <path fill="#FAFCFC" d="M63.344,85.643V66.598h6.398c2.424,0,4.004,0.094,4.74,0.285c1.131,0.286,2.079,0.906,2.842,1.864 c0.763,0.957,1.145,2.192,1.145,3.707c0,1.169-0.221,2.152-0.66,2.951c-0.439,0.796-0.998,1.422-1.676,1.876 c-0.68,0.455-1.367,0.755-2.067,0.903c-0.952,0.183-2.331,0.271-4.136,0.271h-2.599v7.187H63.344z M67.331,69.819v5.404h2.181 c1.572,0,2.622-0.101,3.152-0.301c0.529-0.198,0.945-0.511,1.246-0.936c0.301-0.423,0.451-0.917,0.451-1.481 c0-0.691-0.212-1.263-0.633-1.714c-0.422-0.449-0.956-0.731-1.604-0.843c-0.476-0.087-1.432-0.13-2.867-0.13H67.331z"/>  </g>  </g>  </g></g></svg>'
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
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100.5px" height="100.712px" viewBox="0 0 100.5 100.712" enable-background="new 0 0 100.5 100.712" xml:space="preserve"><g id="Layer_3">  <g id="Arrow_25_11_">  </g>  <g id="Arrow_25_10_">  </g>  <g id="Arrow_25_9_">  </g>  <g id="Arrow_25_8_">  </g>  <g>  <g>  <g>  <rect class="bg" width="90.644" height="90.641"/>  </g>  <g>  <g> <polyline fill="#FFFFFF" points="46.103,34.12 46.103,16.275 49.126,16.275 44.665,9.542 40.198,16.275 43.228,16.275 43.228,34.12 46.103,34.12 "/>  </g>  <g> <polyline fill="#FFFFFF" points="36.998,36.694 24.389,24.081 26.526,21.938 18.607,20.335 20.209,28.256 22.349,26.117 34.962,38.729 36.998,36.694 "/>  </g>  <g> <polyline fill="#FFFFFF" points="32.384,44.961 14.546,44.961 14.546,41.928 7.808,46.393 14.546,50.857 14.546,47.833 32.384,47.833 32.384,44.961 "/>  </g>  <g> <polyline fill="#FFFFFF" points="34.962,54.059 22.349,66.673 20.209,64.532 18.607,72.454 26.526,70.852 24.389,68.706 36.998,56.092 34.962,54.059 "/>  </g>  <g> <polyline fill="#FFFFFF" points="43.228,58.669 43.228,76.516 40.198,76.516 44.665,83.245 49.126,76.516 46.103,76.516 46.103,58.669 43.228,58.669 "/>  </g>  <g> <polyline fill="#FFFFFF" points="56.945,47.833 74.784,47.833 74.784,50.857 81.521,46.393 74.784,41.928 74.784,44.961 56.945,44.961 56.945,47.833 "/>  </g>  <g> <polyline fill="#FFFFFF" points="54.366,38.729 66.981,26.117 69.124,28.256 70.726,20.335 62.807,21.938 64.94,24.081 52.325,36.694 54.366,38.729 "/>  </g>  <g> <path fill="#FFFFFF" d="M56.727,64.779c9.853-6.895,12.246-20.469,5.347-30.311c-6.895-9.852-20.469-12.242-30.31-5.345 c-9.843,6.894-12.242,20.467-5.349,30.316C33.308,69.278,46.881,71.671,56.727,64.779z"/> <path class="bg" d="M44.263,69.197h-0.002c-7.262-0.001-14.081-3.545-18.239-9.48c-7.034-10.049-4.581-23.949,5.466-30.987 c3.76-2.635,8.165-4.027,12.74-4.027c7.263,0,14.081,3.548,18.24,9.49c3.41,4.865,4.721,10.768,3.688,16.62 c-1.031,5.853-4.283,10.953-9.152,14.361C53.242,67.806,48.837,69.197,44.263,69.197z M44.228,25.665 c-4.377,0-8.591,1.332-12.188,3.854c-9.613,6.732-11.959,20.032-5.23,29.646c3.979,5.68,10.502,9.07,17.451,9.07h0.002 c4.375,0,8.59-1.331,12.188-3.85c4.66-3.261,7.77-8.14,8.758-13.739c0.987-5.599-0.266-11.246-3.529-15.9 C57.7,29.059,51.177,25.665,44.228,25.665z"/>  </g>  </g>  </g>  <g>  <g>  <g> <rect x="61.139" y="61.345" fill="#FFFFFF" width="38.861" height="38.867"/>  </g>  <g> <path class="bg" d="M100.5,100.712H60.639V60.845H100.5V100.712z M61.639,99.712H99.5V61.845H61.639V99.712z"/>  </g>  </g>  <g>  <g> <rect x="65.86" y="65.414" class="bg" width="11.133" height="6.783"/>  </g>  <g> <rect x="85.267" y="65.414" class="bg" width="11.133" height="6.783"/>  </g>  <g> <rect x="65.86" y="88.997" class="bg" width="11.133" height="6.784"/>  </g>  <g> <rect x="85.267" y="88.997" class="bg" width="11.133" height="6.784"/>  </g>  <g> <line class="bg" x1="73.61" y1="68.81" x2="87.329" y2="68.81"/> <rect x="73.61" y="68.31" class="bg" width="13.719" height="1"/>  </g>  <g> <line class="bg" x1="73.61" y1="92.393" x2="87.329" y2="92.393"/> <rect x="73.61" y="91.893" class="bg" width="13.719" height="1"/>  </g>  <g> <line class="bg" x1="71.441" y1="89.679" x2="92.919" y2="71.549"/>   <rect x="81.662" y="66.56" transform="matrix(0.6463 0.7631 -0.7631 0.6463 90.5853 -34.1974)" class="bg" width="1.037" height="28.107"/>  </g>  </g>  </g>  </g></g></svg>'

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
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="97.729px" height="100.5px" viewBox="0 0 97.729 100.5" enable-background="new 0 0 97.729 100.5" xml:space="preserve"><symbol  id="Arrow_2" viewBox="-22.86 -13.14 45.72 26.279">  <polygon fill="none" points="-22.86,-13.14 22.86,-13.14 22.86,13.14 -22.86,13.14 "/>  <g>  <polygon fill="#FFFFFF" points="-20.298,-2.933 5.125,-2.933 5.125,-9.242 14.827,0.001 5.125,9.242 5.125,2.934 -20.298,2.934 "/>  </g></symbol><g id="Layer_3">  <g>  <rect x="1.054" y="3.622" class="bg" width="85.997" height="85.994"/>  <g>  <g> <use xlink:href="#Arrow_2"  width="45.72" height="26.279" x="-22.86" y="-13.14" transform="matrix(0 -0.7752 -0.7752 0 44.0518 65.4111)" overflow="visible"/> <use xlink:href="#Arrow_2"  width="45.72" height="26.279" x="-22.86" y="-13.14" transform="matrix(0.5481 -0.5481 -0.5481 -0.5481 19.7305 65.4111)" overflow="visible"/>  </g> <use xlink:href="#Arrow_2"  width="45.72" height="26.279" id="XMLID_126_" x="-22.86" y="-13.14" transform="matrix(-0.0035 -1.1233 -1.1233 0.0035 44.0527 25.7236)" overflow="visible"/>  </g>  <g>  <rect x="57.755" y="60.521" fill="#FFFFFF" width="39.475" height="39.479"/>  <rect x="57.755" y="60.521" fill="none" class="stroke" stroke-miterlimit="10" width="39.475" height="39.479"/>  </g>  <g>  <g>  <path class="bg" d="M91.282,82.053c0.324,0.188,0.372,0.534,0.272,0.805c-1.053,2.592-3.319,9.316-6.654,9.415 c-0.035,0-0.062,0-0.088,0c-2.615,0-4.994-3.649-7.284-11.146c-2.604-8.513-4.829-10.329-6.259-10.329 c-0.016,0-0.034,0.006-0.05,0.006c-2.903,0.077-5.396,7.402-6.111,10.217c-0.083,0.335-0.395,0.513-0.678,0.424 c-0.294-0.089-0.462-0.424-0.379-0.749c0.284-1.131,2.911-10.989,7.141-11.117c2.64-0.051,5.055,3.575,7.369,11.161 c2.601,8.495,4.823,10.311,6.255,10.311c0.017,0,0.035,0,0.049,0c2.489-0.071,4.722-6.392,5.702-8.761 C90.705,81.996,90.957,81.864,91.282,82.053z"/>  </g>  <g>  <path class="bg" d="M92.194,83.413c-1.001,0.394-1.909-0.118-2.215-1.257c-0.463-1.714-3.326-9.299-5.114-9.343 c-0.373-0.052-2.463,0.398-5.236,9.482c-2.488,8.171-5.141,11.987-8.329,11.987c-0.04,0-0.075,0-0.113-0.007 c-4.924-0.146-7.686-10.018-8.192-11.992c-0.245-0.978,0.26-1.987,1.137-2.266c0.875-0.287,1.785,0.284,2.032,1.262 c0.997,3.88,3.319,9.284,5.104,9.334c0.341,0,2.471-0.394,5.247-9.493c2.491-8.169,5.143-11.978,8.323-11.978 c0.04,0,0.078,0,0.117,0.007c4.12,0.112,7.908,11.332,8.143,12.249C93.333,82.314,92.984,83.103,92.194,83.413z"/>  </g>  </g>  </g></g></svg>'
        },
        unknown: {
            width: 36,
            height: 36,
            font: ['\ue60f', '\ue610']
            // icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="99.021px" height="99.021px" viewBox="0 0 99.021 99.021" enable-background="new 0 0 99.021 99.021" xml:space="preserve"><g id="Layer_3">  <g>  <g id="Layer_3_1_">  <g>  <path class="bg" d="M99.021,49.512c0,27.34-22.167,49.51-49.505,49.51C22.17,99.021,0,76.852,0,49.512 C0,22.167,22.17,0,49.517,0C76.854,0,99.021,22.167,99.021,49.512z"/>  </g>  </g>  <g enable-background="new    ">  <g>  <path fill="#FCFAFA" d="M43.434,85.58l-0.125-0.125V74.537l0.125-0.125h10.824l0.125,0.125v10.918l-0.125,0.125H43.434z   M44.187,65.911l-0.125-0.125c0-10.896,2.819-16.03,11.174-20.347c5.347-2.719,7.837-6.422,7.837-11.654 c0-5.756-4.938-9.475-12.58-9.475c-8.322,0-13.062,3.637-14.087,10.81l-0.124,0.106h-9.787l-0.125-0.144 c1.864-12.028,10.76-18.928,24.404-18.928c12.889,0,22.242,7.415,22.242,17.631c0,8.173-4.417,14.428-13.898,19.685 c-4.496,2.471-5.865,5.348-5.865,12.315l-0.125,0.125H44.187z"/>  <path class="bg" d="M50.774,16.28c13.554,0,22.117,7.905,22.117,17.506c0,8-4.329,14.306-13.835,19.575 c-4.801,2.638-5.93,5.836-5.93,12.425h-8.94v-0.001c0-10.824,2.729-15.906,11.106-20.235c5.739-2.918,7.903-6.776,7.903-11.765 c0-5.741-4.987-9.6-12.704-9.6c-8.283,0-13.177,3.67-14.212,10.916h-9.788C28.375,22.962,37.504,16.28,50.774,16.28   M54.258,74.537v10.918H43.434V74.537H54.258 M50.774,16.03c-13.714,0-22.653,6.938-24.528,19.034l0.248,0.287h9.787 l0.248-0.215c1.014-7.102,5.713-10.701,13.963-10.701c7.566,0,12.455,3.67,12.455,9.35c0,5.251-2.396,8.811-7.768,11.542 c-8.406,4.344-11.243,9.506-11.243,20.458l0.25,0.25l8.94,0.001l0.25-0.25c0-6.912,1.354-9.765,5.799-12.206 c9.527-5.281,13.966-11.571,13.966-19.794C73.142,23.498,63.734,16.03,50.774,16.03L50.774,16.03z M54.258,74.287H43.434 l-0.25,0.25v10.918l0.25,0.25h10.824l0.25-0.25V74.537L54.258,74.287L54.258,74.287z"/>  </g>  </g>  </g></g></svg>'
        },
        cloud: {
            width: 96,
            height: 58,
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 111.128 79.276"><g id="Layer_4" transform="matrix(0.89840137,0,0,-0.80074289,45.77195,41.33252)"> <path d="m 56.93,14.529 c 0.609,2.337 0.936,4.785 0.936,7.312 0,15.934 -12.917,28.853 -28.853,28.853 -11.98,0 -22.257,-7.305 -26.618,-17.702 -3.746,4.402 -9.323,7.199 -15.557,7.199 -11.28,0 -20.424,-9.144 -20.424,-20.424 0,-1.939 0.276,-3.814 0.781,-5.59 -9.212,-3.379 -15.776,-12.223 -15.776,-22.609 0,-13.285 10.765,-24.072 24.065,-24.072 H 49.68 c 13.307,0 24.072,10.787 24.072,24.072 0.001,10.774 -7.064,19.889 -16.822,22.961 z" id="path5" fill="#d0d2d3"/></g></svg>'
        },
        collapse: {
            width: 12,
            height: 12,
            font: ['\ue606', '\ue612']
        },
        expand: {
            width: 12,
            height: 12,
            font: ['\ue607', '\ue612']
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
        },
        cisco10700: {
            width: 36,
            height: 36,
            icon: '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="99.058px" height="98.61px" viewBox="0 0 99.058 98.61" enable-background="new 0 0 99.058 98.61" xml:space="preserve"><g id="Layer_3">  <g>  <g>  <path class="bg" d="M90,45.001c0,24.85-20.148,45-44.996,45C20.15,90.001,0,69.851,0,45.001C0,20.148,20.15,0,45.004,0  C69.852,0,90,20.148,90,45.001z"/>  <g>  <polygon fill="#FFFFFF" points="15.256,13.532 32.78,34.429 27.594,38.777 41.879,40.382 42.787,26.035 37.603,30.387 20.076,9.488 "/>  </g>  <g>  <polygon fill="#FFFFFF" points="74.582,77.858 57.904,56.279 63.259,52.142 49.049,49.969 47.569,64.266 52.924,60.126 69.602,81.709 "/>  </g>  <polygon fill="#FFFFFF" points="44.053,50.253 40.205,45.275 18.624,61.949 14.486,56.595 12.312,70.806 26.612,72.285 22.475,66.931 "/>  <polygon fill="#FFFFFF" points="51.452,44.758 73.943,29.321 77.772,34.904 80.744,20.833 66.55,18.552 70.381,24.133 47.889,39.565 "/>  </g>  <g>  <circle fill="#F9F7F7" class="stroke" stroke-width="2" stroke-miterlimit="10" cx="78.058" cy="77.61" r="20"/>  <polygon class="bg" points="75.11,91.287 89.591,81.348 92.061,84.941 93.972,75.885 84.833,74.413 87.298,78.005 72.817,87.944 "/>  <polygon class="bg" points="64.787,83.05 79.269,73.109 81.735,76.704 83.649,67.645 74.511,66.173 76.978,69.769 62.495,79.705 "/>  </g>  </g></g></svg>'
        },
        xswitch: {
            width: 36,
            height: 36,
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="92.376px" height="92.376px" viewBox="0 0 92.376 92.376" enable-background="new 0 0 92.376 92.376" xml:space="preserve"><g id="Layer_3">  <g>  <g>  <g>  <rect class="bg" width="92.376" height="92.376"/>  </g>  </g>  <g>  <g>  <g> <polyline fill="#FFFFFF" points="48.002,34.772 48.002,16.59 51.086,16.59 46.537,9.725 41.983,16.59 45.07,16.59 45.07,34.772 48.002,34.772 "/>  </g>  </g>  <g>  <g> <polyline fill="#FFFFFF" points="38.725,37.4 25.871,24.541 28.051,22.358 19.98,20.723 21.613,28.797 23.796,26.616 36.647,39.473 38.725,37.4 "/>  </g>  </g>  <g>  <g> <polyline fill="#FFFFFF" points="34.021,45.818 15.839,45.818 15.839,42.732 8.977,47.279 15.839,51.834 15.839,48.749 34.021,48.749 34.021,45.818 "/>  </g>  </g>  <g>  <g> <polyline fill="#FFFFFF" points="36.647,55.089 23.796,67.95 21.613,65.769 19.98,73.841 28.051,72.207 25.871,70.021 38.725,57.167 36.647,55.089 "/>  </g>  </g>  <g>  <g> <polyline fill="#FFFFFF" points="45.07,59.791 45.07,77.979 41.983,77.979 46.537,84.839 51.086,77.979 48.002,77.979 48.002,59.791 45.07,59.791 "/>  </g>  </g>  <g>  <g> <polyline fill="#FFFFFF" points="54.344,57.167 67.201,70.021 65.025,72.207 73.094,73.841 71.461,65.769 69.279,67.95 56.425,55.089 54.344,57.167 "/>  </g>  </g>  <g>  <g> <polyline fill="#FFFFFF" points="59.053,48.749 77.232,48.749 77.232,51.834 84.098,47.279 77.232,42.732 77.232,45.818 59.053,45.818 59.053,48.749 "/>  </g>  </g>  <g>  <g> <polyline fill="#FFFFFF" points="56.425,39.473 69.279,26.616 71.461,28.797 73.094,20.723 65.025,22.358 67.201,24.541 54.344,37.4 56.425,39.473 "/>  </g>  </g>  <g>  <g> <path fill="#FFFFFF" d="M58.83,66.016c10.037-7.023,12.479-20.856,5.445-30.888c-7.021-10.042-20.858-12.478-30.889-5.446 c-10.029,7.024-12.473,20.857-5.447,30.895C34.96,70.603,48.793,73.041,58.83,66.016z"/>  </g>  <g> <path class="bg" d="M46.125,70.708L46.125,70.708c-7.465,0-14.471-3.644-18.742-9.742 c-7.227-10.327-4.707-24.608,5.615-31.84c3.863-2.709,8.392-4.141,13.095-4.141c7.464,0,14.47,3.646,18.739,9.755 c3.506,4.998,4.852,11.063,3.791,17.078c-1.062,6.014-4.4,11.252-9.404,14.754C55.354,69.277,50.826,70.708,46.125,70.708z  M46.093,26.342c-4.423,0-8.681,1.348-12.315,3.897c-9.71,6.8-12.08,20.235-5.283,29.946 c4.019,5.739,10.609,9.165,17.631,9.165c4.42,0,8.68-1.345,12.316-3.891c4.706-3.293,7.848-8.222,8.845-13.878 s-0.269-11.361-3.566-16.065C59.703,29.771,53.114,26.342,46.093,26.342z"/>  </g>  </g>  </g>  </g></g></svg>'
        },
        yswitch: {
            width: 36,
            height: 36,
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="96.109px" height="96.497px" viewBox="0 0 96.109 96.497" enable-background="new 0 0 96.109 96.497" xml:space="preserve"><g id="Layer_3">  <g>  <g>  <g>  <g> <rect class="bg" width="87.707" height="87.707"/>  </g>  </g>  <g>  <g> <g> <polyline fill="#FFFFFF" points="45.574,33.018 45.574,15.753 48.504,15.753 44.184,9.236 39.863,15.753 42.793,15.753 42.793,33.018 45.574,33.018 "/> </g>  </g>  <g> <g> <polyline fill="#FFFFFF" points="36.768,35.512 24.564,23.302 26.633,21.232 18.971,19.68 20.52,27.34 22.592,25.274 34.795,37.478 36.768,35.512 "/> </g>  </g>  <g> <g> <polyline fill="#FFFFFF" points="32.301,43.505 15.037,43.505 15.037,40.572 8.521,44.892 15.037,49.214 15.037,46.289 32.301,46.289 32.301,43.505 "/> </g>  </g>  <g> <g> <polyline fill="#FFFFFF" points="34.795,52.308 22.592,64.516 20.52,62.445 18.971,70.109 26.633,68.561 24.564,66.482 36.768,54.278 34.795,52.308 "/> </g>  </g>  <g> <g> <polyline fill="#FFFFFF" points="42.793,56.772 42.793,74.038 39.863,74.038 44.184,80.555 48.504,74.038 45.574,74.038 45.574,56.772 42.793,56.772 "/> </g>  </g>  <g> <g> <polyline fill="#FFFFFF" points="56.066,46.289 73.328,46.289 73.328,49.214 79.848,44.892 73.328,40.572 73.328,43.505 56.066,43.505 56.066,46.289 "/> </g>  </g>  <g> <g> <polyline fill="#FFFFFF" points="53.572,37.478 65.777,25.274 67.85,27.34 69.398,19.68 61.74,21.232 63.805,23.302 51.596,35.512 53.572,37.478 "/> </g>  </g>  <g> <g> <path fill="#FFFFFF" d="M55.857,62.684c9.529-6.67,11.85-19.805,5.17-29.33c-6.666-9.533-19.807-11.847-29.326-5.17 c-9.523,6.67-11.846,19.803-5.174,29.332C33.193,67.035,46.326,69.353,55.857,62.684z"/> </g> <g> <path class="bg" d="M43.795,67.136L43.795,67.136c-7.086,0-13.738-3.459-17.795-9.25 c-6.863-9.805-4.473-23.365,5.332-30.231c3.666-2.571,7.965-3.93,12.432-3.93c7.086,0,13.738,3.462,17.793,9.26 c3.328,4.745,4.605,10.506,3.598,16.217c-1.006,5.71-4.178,10.685-8.928,14.011C52.557,65.779,48.258,67.136,43.795,67.136z M43.764,25.013c-4.199,0-8.242,1.278-11.693,3.697C22.85,35.169,20.6,47.924,27.055,57.146 c3.816,5.448,10.074,8.702,16.74,8.702c4.197,0,8.24-1.278,11.691-3.693c4.469-3.127,7.453-7.808,8.4-13.179 S63.631,38.189,60.5,33.724C56.686,28.269,50.43,25.013,43.764,25.013z"/> </g>  </g>  </g>  </g>  <g>  <g> <rect x="60.517" y="72.934" transform="matrix(-1 0.0048 -0.0048 -1 137.0606 154.538)" fill="none" width="15.654" height="8.999"/>  </g>  </g>  <g>  <g> <rect x="76.781" y="72.938" transform="matrix(1 -0.0053 0.0053 1 -0.4096 0.4499)" fill="none" width="15.647" height="8.991"/>  </g>  </g>  <g>  <g> <rect x="68.932" y="83.21" transform="matrix(0.0061 -1 1 0.0061 -11.419 163.925)" fill="none" width="15.647" height="8.994"/>  </g>  </g>  <g>  <g>  <g> <g> <g> <rect x="60.07" y="60.454" fill="#FFFFFF" width="35.371" height="35.374"/> </g> </g> <g> <g> <path class="bg" d="M96.109,96.497H59.4V59.784h36.709V96.497z M60.74,95.158h34.031V61.124H60.74V95.158z"/> </g> </g>  </g>  </g>  <g>  <g> <g> <polygon class="bg" points="62.398,79.472 71.104,79.429 71.115,81.591 74.42,78.407 71.084,75.261 71.094,77.423 62.389,77.462 "/> </g>  </g>  </g>  <g>  <g>   <rect x="69.928" y="63.239" transform="matrix(-0.0145 0.9999 -0.9999 -0.0145 146.6114 -9.0301)" fill="none" width="15.655" height="8.997"/>  </g>  </g>  <g>  <g> <g> <polygon class="bg" points="78.658,74.702 78.785,65.997 80.943,66.028 77.83,62.662 74.617,65.937 76.777,65.967 76.65,74.672 "/> </g>  </g>  </g>  <g>  <g> <g> <polygon class="bg" points="92.547,77.392 83.846,77.44 83.834,75.281 80.529,78.461 83.865,81.607 83.855,79.445 92.555,79.402 "/> </g>  </g>  </g>  <g>  <g> <g> <polygon class="bg" points="76.795,81.755 76.742,90.453 74.582,90.439 77.725,93.78 80.908,90.479 78.75,90.466 78.803,81.768 "/> </g>  </g>  </g>  </g>  </g></g></svg>'
        },
        zswitch: {
            width: 36,
            height: 36,
            icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="120.614px" height="82.5px" viewBox="0 0 120.614 82.5" enable-background="new 0 0 120.614 82.5" xml:space="preserve"><g id="Layer_6"></g><g id="Layer_7"></g><g id="Layer_8"></g><g id="Layer_3">  <g>  <g>  <g>  <g> <rect x="38.111" class="bg" width="82.503" height="82.5"/>  </g>  </g>  <g>  <g> <g> <polyline fill="#FFFFFF" points="80.98,31.055 80.98,14.814 83.735,14.814 79.674,8.685 75.609,14.814 78.364,14.814 78.364,31.055 80.98,31.055 "/> </g>  </g>  <g> <g> <polyline fill="#FFFFFF" points="72.696,33.399 61.219,21.918 63.165,19.967 55.957,18.508 57.415,25.716 59.361,23.773 70.842,35.252 72.696,33.399 "/> </g>  </g>  <g> <g> <polyline fill="#FFFFFF" points="68.496,40.922 52.261,40.922 52.261,38.161 46.126,42.227 52.261,46.289 52.261,43.536 68.496,43.536 68.496,40.922 "/> </g>  </g>  <g> <g> <polyline fill="#FFFFFF" points="70.842,49.203 59.361,60.685 57.415,58.738 55.957,65.947 63.165,64.489 61.219,62.535 72.696,51.055 70.842,49.203 "/> </g>  </g>  <g> <g> <polyline fill="#FFFFFF" points="78.364,53.4 78.364,69.644 75.609,69.644 79.674,75.768 83.735,69.644 80.98,69.644 80.98,53.4 78.364,53.4 "/> </g>  </g>  <g> <g> <polyline fill="#FFFFFF" points="86.646,51.055 98.129,62.535 96.187,64.489 103.395,65.947 101.937,58.738 99.987,60.685 88.503,49.203 86.646,51.055 "/> </g>  </g>  <g> <g> <polyline fill="#FFFFFF" points="90.853,43.536 107.088,43.536 107.088,46.289 113.219,42.227 107.088,38.161 107.088,40.922 90.853,40.922 90.853,43.536 "/> </g>  </g>  <g> <g> <polyline fill="#FFFFFF" points="88.503,35.252 99.987,23.773 101.937,25.716 103.395,18.508 96.187,19.967 98.129,21.918 86.646,33.399 88.503,35.252 "/> </g>  </g>  <g> <g> <path fill="#FFFFFF" d="M90.651,58.961c8.968-6.275,11.146-18.629,4.868-27.589c-6.275-8.967-18.632-11.142-27.588-4.864 c-8.958,6.276-11.143,18.628-4.868,27.593C69.337,63.057,81.689,65.233,90.651,58.961z"/> </g> <g> <path class="bg" d="M79.307,63.188C79.306,63.188,79.306,63.188,79.307,63.188c-6.679,0-12.947-3.26-16.77-8.718 c-6.467-9.238-4.212-22.02,5.025-28.492c3.456-2.422,7.507-3.701,11.714-3.701c6.678,0,12.947,3.261,16.771,8.724 c3.136,4.477,4.34,9.904,3.391,15.284c-0.949,5.381-3.938,10.07-8.417,13.204C87.563,61.908,83.513,63.188,79.307,63.188z M79.276,23.564c-3.941,0-7.736,1.201-10.974,3.471c-8.656,6.064-10.77,18.04-4.711,26.695 c3.583,5.115,9.457,8.169,15.714,8.169c0,0,0,0,0.001,0c3.94,0,7.735-1.197,10.976-3.467 c4.195-2.936,6.997-7.329,7.886-12.371c0.89-5.041-0.238-10.126-3.177-14.32C91.409,26.623,85.534,23.564,79.276,23.564z"/> </g>  </g>  </g>  </g>  <g>  <g>  <rect x="20.662" y="18.818" class="bg" width="17.643" height="5.915"/>  </g>  </g>  <g>  <g>  <rect x="20.662" y="61.626" class="bg" width="17.643" height="5.918"/>  </g>  </g>  <g>  <g>  <rect x="14.4" y="33.088" class="bg" width="23.904" height="5.916"/>  </g>  </g>  <g>  <g>  <rect y="47.356" class="bg" width="38.305" height="5.918"/>  </g>  </g>  </g></g></svg>'
        },
        nodeSet: {
            width: 36,
            height: 36,
            font: ['\ue607', '\ue607']
        }
    };


    nx.each(topology_icon, function (icon, key) {
        var i = ICONS.icons[key] = {
            size: {width: icon.width, height: icon.height},
            name: key
        };

        if (icon.font) {
            i.font = icon.font;
        } else if (icon.icon) {
            i.icon = new DOMParser().parseFromString(icon.icon, "text/xml").documentElement.cloneNode(true);
        }
    });

})(nx, nx.global);
