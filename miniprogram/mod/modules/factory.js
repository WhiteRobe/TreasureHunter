/**
 * 样例标记点输出
 */
// {
//   iconPath: '../../resources/images/neil.png',
//   id: $_0,
//   callout: {
//     content: "$_markername",
//     textAlign: "center",
//     fontSize: "13",
//     borderRadius: "12",
//     borderWidth: "2",
//     borderColor: "#f37b1d", // orange
//     padding: "6",
//     display: "ALWAYS",
//     bgColor: "#ffffff" // white
//   },
//   // title:"标记点样例title",
//   latitude: $_34.34127,
//   longitude: $_108.93983,
//   width: 18,
//   height: 18,
//   extend: {
//     text: "$_样例谜题",
//     img: "$_样例图地址",
//     condition: ["$_geoname1", "$_geoname2", "$_geoname3"]
//   }
// }
function buildMarker(martker_id, marker_name, geo, ext_info) {
  return {
    iconPath: '../../resources/images/neil.png',
    id: martker_id,
    callout: {
      content: marker_name,
      textAlign: "center",
      fontSize: "13",
      borderRadius: "12",
      borderWidth: "2",
      borderColor: "#f37b1d", // orange
      padding: "6",
      display: "ALWAYS",
      bgColor: "#ffffff" // white
    },
    // title: marker_name, 将被忽略
    latitude: geo.latitude,
    longitude: geo.longitude,
    width: 18,
    height: 18,
    extend: ext_info
  };
}

module.exports.buildMarker = buildMarker;