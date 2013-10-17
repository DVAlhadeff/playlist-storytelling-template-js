define(["storymaps/utils/Helper","storymaps/playlist/ui/Map","storymaps/playlist/ui/List","lib/jquery/jquery-1.10.2.min"],
	function(Helper, Map, List){

		/**
		* Core
		* @class Core
		*
		* Main class for story map application
		*
		* Dependencies: Jquery 1.10.2
		*/

		var _readyState = {
			map: false,
			list: false
		},
		_layersReady = 0,
		_map = new Map(configOptions.geometryServiceUrl,configOptions.bingMapsKey,configOptions.webmap,"map",".playlist-item",onMapLoad,onLayersUpdate,onMarkerOver,onMarkerOut),
		_list = new List("#playlist",onListLoad);

		function init ()
		{
			Helper.enableRegionLayout();

			if (configOptions.sharingUrl && location.protocol === "https:"){
				configOptions.sharingUrl = configOptions.sharingUrl.replace('http:', 'https:');
			}

			if (configOptions.geometryServiceUrl && location.protocol === "https:"){
				configOptions.geometryServiceUrl = configOptions.geometryServiceUrl.replace('http:', 'https:');
			}

			loadMap();
		}


		// MAP FUNCTIONS
		
		function loadMap()
		{
			Helper.updateLoadingMessage("Accessing Maps");
			_map.init();
		}

		function onMapLoad(item)
		{
			updateText(item.title,item.snippet);
			_readyState.map = true;
			checkReadyState();
		}

		function onLayersUpdate(graphics)
		{
			if (_list){
				updatePlaylist(graphics);
			}
		}

		function onMarkerOver(item)
		{
			if(_list){
				_list.highlight(item);
			}
		}

		function onMarkerOut(item)
		{
			if(_list){
				_list.removeHighlight(item);
			}
		}


		// LIST FUNCTIONS

		function onListLoad()
		{
			_layersReady++;
			if (_layersReady === _map.getLayerCount()){
				_readyState.list = true;
				checkReadyState();
			}
		}

		function updatePlaylist(graphics)
		{
			_list.update(graphics);
		}

		function updateText(title,subtitle)
		{
			$("#title").html(configOptions.title || title || "");
			$("#subtitle").html(configOptions.subtitle || subtitle || "");
		}

		function checkReadyState()
		{
			var ready = true;

			for (var i in _readyState){
				if (!_readyState[i]){
					ready = false;
				}
			}
			appReady(ready);
		}

		function appReady(ready)
		{
			if (ready){
				Helper.removeLoadScreen();
			}
		}

		return {
			init: init
		};
});