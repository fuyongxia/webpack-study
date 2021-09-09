registerPlugin({
    install: function(less, pluginManager, functions) {
        functions.add('height', function() {
            return new tree.Dimension(100,'px');
        });
    }
})