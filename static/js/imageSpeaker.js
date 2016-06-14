var IMAGE_BASE_PATH = "./static/images/";

var imageData = {
	"food" :
	[
		{
			"name" : "牛肉面",
			"imageURL" : "http://food.365jia.cn/uploads/news/folder_169886/images/%E7%89%9B%E8%82%89%E9%9D%A2.jpg",
			"correct" : false
		},
		{
			"name" : "芥兰牛肉",
			"imageURL" : "http://chinatownwiki.com/wiki/images/thumb/3/3a/GuyLanAuYop_JadeChineseCuisine_DSC_0051.jpg/688px-GuyLanAuYop_JadeChineseCuisine_DSC_0051.jpg",
			"correct" : false
		},
		{
			"name" : "牛肉卷饼",
			"imageURL" : "http://8232.china720.cn/attachment/CkfUploads/images/%E7%89%9B%E8%82%89%E6%8D%B2%E9%A4%85.jpg",
			"correct" : false
		}
	]
};

var imageController = {
	getImageData: function() {
		return imageData.food;
	}
};

var imageWrapperView = {
	init: function() {
		this.imageWrapper = $(".imageWrapper");
	},

	render: function() {
		imageController.getImageData().forEach(function(food, i) {
			imageDiv = "";
			imageDiv += "<div class='imageShown'>";
			imageDiv += "<img src='" + food.imageURL + "'>";
			imageDiv += "</div>";
		});
	}
};

