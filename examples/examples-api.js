document.addEventListener("polymer-ready", function(){
    function callMethod(element, method, event){
        var args = event.target.parentElement.querySelectorAll("input")
                    .array().map(function(e){return parseInt(e.value)});
        args[0] = element.items[args[0]];
        element[method].apply(element, args);
        element.refresh();
    }
    document.getElementById("callResize").addEventListener("click", function (event){
        callMethod( document.querySelector("juicy-tile-list"), "resizeItem", event );
    });
    document.getElementById("callReprioritize").addEventListener("click", function (event){
        callMethod( document.querySelector("juicy-tile-list"), "reprioritizeItem", event );
    });
});