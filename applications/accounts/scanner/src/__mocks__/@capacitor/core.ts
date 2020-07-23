import * as Core from '@capacitor/core';

Core.Capacitor.isPluginAvailable = jest.fn().mockReturnValue(true);

Core.Plugins.Browser.open = jest.fn();

module.exports = Core;
