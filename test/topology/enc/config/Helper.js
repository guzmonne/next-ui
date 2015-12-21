var DEVICETYPEMAP = {
    SWITCH: 'switch',
    ROUTER: 'router',
    AP: 'accesspoint',
    UNKNOWN: 'unknown',
    asr: 'nexus5000',
    WIRED: 'host',
    access: 'accesspoint',
    core: 'groupm',
    WLC: 'wlc',
    accesspoint: 'accesspoint',
    WIRELESS: ''
};
var COLORTABLE = ['#C3A5E4', '#75C6EF', '#CBDA5C', '#2CC86F'];


nx.define("ENC.TW.converter", {
    statics: {
        icon: {
            convert: function (value) {
                return 'n-icon-' + (DEVICETYPEMAP[value] || value);
            }
        }
    }
});