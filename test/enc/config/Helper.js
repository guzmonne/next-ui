var deviceTypeMapping = {
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

nx.define("ENC.TW.converter", {
    statics: {
        icon: {
            convert: function (value) {
                return 'n-icon-' + (deviceTypeMapping[value] || value);
            }
        }
    }
});