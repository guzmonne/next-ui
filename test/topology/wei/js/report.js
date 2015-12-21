/**
 * Created by bob on 14-2-27.
 */
(function (nx) {
    nx.define("topo.test.report", nx.ui.Component, {
        view: {
            content:[
                {
                    tag:'p',
                    props:{
                        id:'qunit-testresult'
                    }
                },
                {
                    tag:'ol',
                    props:{
                        id:'qunit-tests'
                    }
                }
            ]
        }
    });
})(nx)