describe('jan', function() {
	var jan;

	it('should be exposed via require("jan")', function(done) {
		require(['jan'], function(lib) {
			jan = lib;

			expect(jan).to.exist;
			expect(jan).to.be.a('function');
			done();
		});
	});


	it('should be an alias of jan.request()', function() {
		expect(jan).to.equal(jan.request);
	});

});
