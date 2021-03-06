var Detect = {};

Detect.isIpad = function() {
    return /ipad/i.test(navigator.userAgent.toLowerCase());
};

Detect.isAndroid = function() {
    return /Android/i.test(navigator.userAgent);
};

Detect.isWindows = function() {
      return Detect.userAgentContains('Windows');
};

Detect.isChromeOnWindows = function() {
    return Detect.userAgentContains('Chrome') && Detect.userAgentContains('Windows');
};

Detect.isCanaryOnWindows = function() {
    return Detect.userAgentContains('Chrome/52') && Detect.userAgentContains('Windows');
};

Detect.isEdgeOnWindows = function() {
    return Detect.userAgentContains('Edge') && Detect.userAgentContains('Windows');
};

Detect.isFirefox = function() {
    return Detect.userAgentContains('Firefox');
};

Detect.isSafari = function() {
    return Detect.userAgentContains('Safari') && !Detect.userAgentContains('Chrome');
};

Detect.isOpera = function() {
    return Detect.userAgentContains('Opera');
};

Detect.isFirefoxAndroid = function() {
    return Detect.userAgentContains('Android') && Detect.userAgentContains('Firefox');
};

Detect.userAgentContains = function(string) {
    return navigator.userAgent.indexOf(string) != -1;
};

Detect.isTablet = function(screenWidth) {
    var userAgent = navigator.userAgent.toLowerCase(),
        isAppleTablet = /ipad/i.test(userAgent),
        isAndroidTablet = /android/i.test(userAgent);

    return (isAppleTablet || isAndroidTablet) && screenWidth >= 640;
};

Detect.isAppleDevice = function() {
    var devices = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ];

    if (!!navigator.platform)
        while(devices.length)
            if (navigator.platform = devices.pop())
                return true;

    return false;
};