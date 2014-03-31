(function (nx, global) {


    var Container = nx.define(nx.ui.Component, {
        view: {
            props: {
                'class': 'nx n-popupContainer',
                style: {
                    'position': 'absolute',
                    'top': '0px',
                    'left': '0px'

                }
            }
        }
    });

    /**
     * Popup container
     * @class nx.ui.PopupContainer
     * @static
     */

    nx.define("nx.ui.PopupContainer", {
        static: true,
        properties: {
            container: {
                value: function () {
                    return new Container();
                }
            }
        },
        methods: {
            addPopup: function (popup) {
                this.container().view().dom().appendChild(popup.view().dom());
            }
        }
    });


    nx.dom.Document.ready(function () {
//        if (document.body.firstChild) {
//            document.body.insertBefore(nx.ui.PopupContainer.container().resolve('@root').$dom, document.body.firstChild);
//        } else {
//            document.body.appendChild(nx.ui.PopupContainer.container().resolve('@root').$dom);
//        }
    }, this);


    setTimeout(function () {
        if (document.body) {
            if (document.body.firstChild) {
                document.body.insertBefore(nx.ui.PopupContainer.container().resolve('@root').$dom, document.body.firstChild);
            } else {
                document.body.appendChild(nx.ui.PopupContainer.container().resolve('@root').$dom);
            }
        } else {
            setTimeout(arguments.callee, 10);
        }
    }, 0);


})(nx, nx.global);