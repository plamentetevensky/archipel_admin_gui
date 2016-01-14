/*!
 * Ext JS Library
 * Copyright(c) 2006-2014 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('Desktop.App', {
    extend: 'Ext.ux.desktop.App',

    requires: [
        'Ext.window.MessageBox',

        'Ext.ux.desktop.ShortcutModel',
        // system modules
        'Desktop.modules.system.SystemStatus',
        'Desktop.modules.system.DesktopSettings',
        // media modules
        'Desktop.modules.media.VideoPlayer',
        
        'Desktop.GridWindow',
        'Desktop.TabWindow',
        'Desktop.AccordionWindow',
        'Desktop.Notepad',
        'Desktop.BogusMenuModule',
        'Desktop.BogusModule'
    ],

    init: function() {
        // custom logic before getXYZ methods get called...
        var self = this;
        
        if (localStorage.getItem("AuthToken")) {
            // TODO: Check/refresh auth_token
            self.callParent();
        } else {
            var win;
            win = Ext.create('widget.window', {
                title: 'Login',
                modal: true,
                bodyPadding: 10,
                resizable   : false,
                draggable   : false,
                closable    : false,
                autoShow: true,
                items: [{
                    region: 'center',
                    reference: 'form',
                    items: [{
                        xtype: 'textfield',
                        name: 'username',
                        fieldLabel: 'Username',
                        allowBlank: false
                    }, {
                        xtype: 'textfield',
                        name: 'password',
                        inputType: 'password',
                        fieldLabel: 'Password',
                        allowBlank: false
                    }],
                    buttons: [{
                        text: 'Login',
                        formBind: true,
                        listeners: {
                            click: 'onLoginClick'
                        },
                        onLoginClick: function() {
                            // TODO: Check login and get auth_token
                            localStorage.setItem("AuthToken", "abcdef");
                            win.close();
                            self.init();
                        }
                    }]
                }]
            })
        }
    },
    
    getModules : function(){
        return [
            // system modules
            new Desktop.modules.system.SystemStatus(),
            
            // media modules
            new Desktop.modules.media.VideoPlayer(),
            
            new Desktop.GridWindow(),
            new Desktop.TabWindow(),
            new Desktop.AccordionWindow(),
            new Desktop.Notepad(),
            new Desktop.BogusMenuModule(),
            new Desktop.BogusModule()
        ];
    },

    getDesktopConfig: function () {
        var me = this, ret = me.callParent();

        return Ext.apply(ret, {
            contextMenuItems: [
                { text: 'Change desktop settings', handler: me.onSettings, scope: me }
            ],

            shortcuts: Ext.create('Ext.data.Store', {
                model: 'Ext.ux.desktop.ShortcutModel',
                data: [
                    { name: 'Grid Window', iconCls: 'grid-shortcut', module: 'grid-win' },
                    { name: 'Accordion Window', iconCls: 'accordion-shortcut', module: 'acc-win' },
                    { name: 'Notepad', iconCls: 'notepad-shortcut', module: 'notepad' },
                    { name: 'System Status', iconCls: 'cpu-shortcut', module: 'modules_system_systemstatus'}
                ]
            }),

            wallpaper: 'resources/images/wallpapers/Blue-Sencha.jpg',
            wallpaperStretch: false
        });
    },

    // config for the start menu
    getStartConfig : function() {
        var me = this, ret = me.callParent();

        return Ext.apply(ret, {
            title: 'Don Griffin',
            iconCls: 'user',
            height: 300,
            toolConfig: {
                width: 100,
                items: [
                    {
                        text:'Desktop settings',
                        iconCls:'settings',
                        handler: me.onSettings,
                        scope: me
                    },
                    '-',
                    {
                        text:'Logout',
                        iconCls:'logout',
                        handler: me.onLogout,
                        scope: me
                    }
                ]
            }
        });
    },

    getTaskbarConfig: function () {
        var ret = this.callParent();

        return Ext.apply(ret, {
            quickStart: [
                { name: 'Accordion Window', iconCls: 'accordion', module: 'acc-win' },
                { name: 'Grid Window', iconCls: 'icon-grid', module: 'grid-win' }
            ],
            trayItems: [
                { xtype: 'trayclock', flex: 1 }
            ]
        });
    },

    onLogout: function () {
        var self = this;
        Ext.Msg.confirm('Logout', 'Are you sure you want to logout?',
            function(btn){
                if (btn == 'yes') {
                    //TODO: Remove auth_token from server
                    localStorage.removeItem("AuthToken");
                    self.desktop.destroy();
                    self.init();
                }
        });
    },

    onSettings: function () {
        var dlg = new Desktop.modules.system.DesktopSettings({
            desktop: this.desktop
        });
        dlg.show();
    }
});

