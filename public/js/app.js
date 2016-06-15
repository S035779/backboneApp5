var Memo = Backbone.Model.extend({
    idAttribute:"_id",
    defaults:{
        "content":""
    },
    validate:function (attributes) {
        if (attributes.content === "") {
            return "content must be not empty.";
        }
    }
});
 
var MemoList = Backbone.Collection.extend({
    model:Memo,
    url:"/memo"
});
 
var memoList = new MemoList();

// RESTful sample 5-1
//monitoring object
var observer = {
    showArguments:function () {
        console.log("+++observer.showArguments: ");
        _.each(arguments, function (item, index) {
            console.log("  +++arguments[" + index + "]: " + JSON.stringify(item));
        });
    }
};
// ex.) _extend([monitoring_onject], Backbone.Events); 
_.extend(observer, Backbone.Events);
// ex.) [monitoring_object].listenTo( target, event, callback ); 
observer.listenTo(memoList, "all", observer.showArguments);

//---
var memo = new Memo({content: "Marimo"});

console.log("add");
memoList.add(memo);

console.log("change");
memo.set({content: "Marimo Design.,Inc."});

console.log("remove");
memoList.remove(memo);

console.log("reset");
memoList.add([new Memo({content: "Mamo1"}), new Memo({content: "Mamo2"}), new Memo({content: "Mamo3"})]);
console.log("Before reset: " + JSON.stringify(memoList));
memoList.reset([new Memo({content: "Mamo"}), new Memo({content: "Design.,Inc."}), new Memo({content: "Marimo"})]);
console.log("After reset: " + JSON.stringify(memoList));

console.log("sort");
memoList.comparator = function(item) {
   return item.get("content");
};
memoList.sort();
console.log("After sort: " + JSON.stringify(memoList));

// ex.) [monitoring_object].stopListening();
observer.stopListening();

// RESTful sample 5-2
memoList = new MemoList();
// ex.) [monitoring_object].listenTo( target, event, callback ); 
observer.listenTo(memoList, "all", observer.showArguments);

console.log("request, sync");
 
memo = new Memo({content:"Hashimoto"}, {collection:memoList});
 
console.log("create");
memo.save(null, {
    success:function () {
        console.log("After create memoList: " + JSON.stringify(memoList));
        console.log("After create memoList.length: " + memoList.length);
    }
}).pipe(function () {
    console.log("fetch");
    return memoList.fetch({
        success:function () {
            console.log("After fetch memoList: " + JSON.stringify(memoList));
            console.log("After fetch memoList.length: " + memoList.length);
        }
    });
}).pipe(function () {
    var tempMemo = memoList.find(function (item) {
        return item.get("content") === "Hashimoto";
    });
 
    console.log("invalid");
    tempMemo.save({content:""});
 
    console.log("invalid wait:true");
    tempMemo.save({content:""}, {wait:true});
 
    console.log("re-save");
 
    return tempMemo.save({content:"Mamoru"}, {
        success:function () {
            console.log("After save memoList: " + JSON.stringify(memoList));
            console.log("After save memoList.length: " + memoList.length);
        }
    });
}).done(function () {
    console.log("destroy");
 
    var tempMemo = memoList.find(function (item) {
        return item.get("content") === "Mamoru";
    });
 
    return tempMemo.destroy({
        success:function () {
            console.log("After destroy memoList: " + JSON.stringify(memoList));
            console.log("After destroy memoList.length: " + memoList.length);
        }
    });
});
 
memoList.add(memo);
 
console.log("After add memo: " + JSON.stringify(memo));
console.log("After add memoList.length: " + memoList.length);

