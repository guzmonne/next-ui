(function (nx) {
    nx.define('odl.view.LoginView', nx.ui.Component, {
        view: {
            props: {
                'class': ['odl-login', '{loginStatus}']
            },
            content: {
                props: {
                    'class': 'odl-login-panel'
                },
                content: [
                    {
                        tag: 'h1',
                        props: [],
                        content: 'Cisco WAN Controller'
                    },
                    {
                        tag: 'form',
                        props: {
                            'class': 'form-horizontal'
                        },
                        content: [
                            {
                                props: {
                                    'class': 'form-group',
                                    content: [
                                        {
                                            tag: 'label',
                                            props: {
                                                'class': 'col-sm-4 control-label'
                                            },
                                            content: 'Username'
                                        },
                                        {
                                            props: {
                                                'class': 'col-sm-8'
                                            },
                                            content: {
                                                tag: 'input',
                                                props: {
                                                    type: 'text',
                                                    value: '{account.username}',
                                                    placeholder: 'Username',
                                                    'class': 'form-control'
                                                }
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                props: {
                                    'class': 'form-group',
                                    content: [
                                        {
                                            tag: 'label',
                                            props: {
                                                'class': 'col-sm-4 control-label'
                                            },
                                            content: 'Password'
                                        },
                                        {
                                            props: {
                                                'class': 'col-sm-8'
                                            },
                                            content: {
                                                tag: 'input',
                                                props: {
                                                    type: 'text',
                                                    value: '{account.password}',
                                                    placeholder: 'Password',
                                                    'class': 'form-control'
                                                }
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                tag: 'button',
                                props: {
                                    'class': 'btn btn-block',
                                    type: 'button'
                                },
                                events: {
                                    click: '{login}'
                                },
                                content: 'Sign in'
                            }
                        ]
                    }
                ]
            }
        }
    });
})(nx);