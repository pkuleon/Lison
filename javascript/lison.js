/**
 * ...
 * @author pkuleon
 */

(function(root){
    
    // your code 
    var lison = function(express, obj){
        express = express || [];
        obj = obj || {};
            
        var MAX_LOOP = 65535; //Math.pow(2,16)-1; // 16bit = 65535
        
        
    };
    
    
    if (typeof exports === "object" && exports) {
        exports = lison; // CommonJS
    }else if (typeof coco === "object" && coco && coco.register) {
        coco.register('lison', lison);
    }if (typeof window === "object" && window) {
        window.lison = lison;
    }else{
        root.lison = lison; // <script>
    }
    
})(this);