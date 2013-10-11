define(["esri/map","esri/arcgis/utils","esri/dijit/Popup","dojo/on","dojo/dom-construct"], 
	function(Map,arcgisUtils,Popup,On,domConstruct){
	/**
	* Playlist Map
	* @class Playlist Map
	* 
	* Class to define a new map for the playlist template
	*/

	return function PlaylistMap(geometryServiceURL,bingMapsKey,webmapId,selector,onLoad)
	{

		var _map,
		_pointLayers = [];

		this.init = function(){

			var popup = new Popup(null,domConstruct.create("div"));

			arcgisUtils.createMap(webmapId,selector,{
				mapOptions: {
					infoWindow: popup
				},
				geometryServiceURL: geometryServiceURL,
				bingMapsKey: bingMapsKey
			}).then(function(response){
				
				_map = response.map;

				getPointLayers(response.itemInfo.itemData.operationalLayers);

				On.once(_map,"update-end",function(){
					if(onLoad){
						onLoad();
					}
				});

			});
		}

		function getPointLayers(layers)
		{
			dojo.forEach(layers,function(layer){
				if (layer.featureCollection && layer.featureCollection.layers.length > 0){
					dojo.forEach(layer.featureCollection.layers,function(l){
						if (l.layerDefinition.geometryType === "esriGeometryPoint" && l.visibility){
							_pointLayers.push(l.layerObject);
						}
					});
				}
			});
		}
	}

});