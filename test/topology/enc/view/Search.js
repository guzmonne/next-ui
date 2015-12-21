(function (nx, global) {

    nx.define("ENC.TW.View.Search", nx.ui.Component, {
        view: {
            props: {
                'class': 'tw-search'
            },
            content: [
                {
                    tag: 'input',
                    props: {
                        'placeHolder': 'Search'
                    }
                }
            ]
        },
        methods: {

        }
    });


})(nx, nx.global);