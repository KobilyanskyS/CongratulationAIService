function showCookieBanner(){
    document.getElementById("cb-cookie-banner").style.display  = "block";
}

function hideCookieBanner(){
    document.cookie = "cb_isCookieAccepted=yes; max-age=31104000; secure";
    document.getElementById("cb-cookie-banner").style.display  = "none";
}

function initializeCookieBanner(){
    let isCookieAccepted = (document.cookie.match('(^|; )' + encodeURIComponent('cb_isCookieAccepted') + '=([^;]+)') || []).pop() || null;
    if(isCookieAccepted === null)
    {
        document.cookie = "cb_isCookieAccepted=no";
        showCookieBanner();
    }
    if(isCookieAccepted === "no"){
        showCookieBanner();
    }
}

window.onload = initializeCookieBanner();
window.cb_hideCookieBanner = hideCookieBanner;