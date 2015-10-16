exports.checkRules = function(region,req)
{
	var rules_db = req.db_rules;
	var sensors_db = req.db_sensors;
	var rules_collection = rules_db.get('rules');
	var notification = global.notifications;
	console.log('-----------------------------------------------checkRules_Region',region);

	var sensors_ids = [];
	var sensors = region.sensors;
	//Gets list of sensor ids under a given region
	for(var i=0;i<sensors.length;i++){
		var sensor = sensors[i];
		sensors_ids.push(sensor.id.toString());
	}

	//Searches for rules that use the sensors under the region, in order to get the device ids
	rules_collection.find({'sensor_id':{$in: sensors_ids}},{},function(e,docs){
		var _ = require('underscore');
		if(docs.length>0)
		{	
			var registration_ids=[];
			var sensor_names = [];
			for(var i=0;i<docs.length;i++)
			{
				var registID = docs[i].device_id;
				//only add if not already in it
				if(!_.contains(registration_ids,registID))
					registration_ids.push(registID);
				if(!_.contains(sensor_names,docs[i].sensor_name))
					sensor_names.push(docs[i].sensor_name);

				
			}

			var jsonQuery = require('json-query');
			var regId_req = [];
			var sensorNames_req = [];
			//Gets rules for only one registration id, and sends a notification for that
			console.log("####################3",docs);
			console.log("global_rules_registration_ids",registration_ids);
			for(var i=0;i<registration_ids.length;i++){
				var id = registration_ids[i];
				//var test = jsonQuery(['[device_id=?]',id.toString()],{data:docs}).value;
				var gr = getRules;
				var registIds_sensors = docs.filter(function(value){
					return gr(id,value);
				});
				for(var j=0;j<registIds_sensors.length;j++){
					var elem = registIds_sensors[j];
					sensorNames_req.push(elem.sensor_name);
				}
				regId_req.push(id);
				region.sensors = sensorNames_req;
				console.log('checkRules_ids',regId_req);
				console.log('checkRules_sensorNames_req',sensorNames_req);
				console.log('----------------------------checkRules_region',region);
				notification.sendGCM(regId_req,region);
				regId_req=[];
				sensorNames_req=[];

			}

			//region.sensors = sensor_names;
			//notification.sendGCM(registration_ids,region);

			//console.log('rules',docs);

		}
	});
   
   function getRules(id,value){
   		return value.device_id == id;
   }
}
