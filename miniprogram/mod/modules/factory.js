/**
 * 样例标记点输出
 */
// {
//   iconPath: '../../resources/images/neil.png',
//   id: 0,
//   callout: {
//     content: "$_geoname",
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
//   latitude: 34.34127,
//   longitude: 108.93983,
//   width: 18,
//   height: 18,
//   extend: {
//     _gamecode: "A1B2C3",
//     text: "样例谜题",
//     img: "样例图地址",
//     condition: [{
//       _gamecode: "A1B2C3",
//       _geoname: "$_geoname",
//     }]
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