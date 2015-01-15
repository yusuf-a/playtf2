var player = {}
var kills = []
var deaths = []
$(function(){

	/* formulate player vitals */
	$.post('/get/player/vitals',{
		player_id: $(".data").text()
	}, function(data){
		$("#cover").hide()

		$("#elo").text(parseInt(data.elo))
		$("#mean").text(data.mu.toFixed(2))
		$("#sigma").text(data.sigma.toFixed(2))

		$("#main").html("{0}<br>{1}".format(data.name, data.steamID))
	}, "json")

	/* form kill stats */
	$.post('/get/player/kill_stats',{
		player_id: $(".data").text()
	}, function(data){
		$("#cover").hide()

		deaths = data.death
		kills = data.kill

		$("#kills").text(data.kills)
		$("#deaths").text(data.deaths)

		makeCharts(kills, 'kill_chart', "Kills: ")
		makeCharts(deaths, 'deth_chart', "Deaths: ")
	}, "json")

	/* populate trueskil plot */
	$.post('/get/player/trueskill',{
		player_id: $(".data").text()
	}, function(data){
		player = data

		$("#bellCurve").html("");
		$.jqplot('bellCurve',
			[NormalZ_all(500,player.mu,player.sigma),
			NormalZ_all(500,player.bestMu,player.bestSigma)],
		{ 
			title:'Estimate of Player\'s Skill',
			seriesDefaults:{showMarker: false,},
			grid:{background: '#f7f7f7'},
			highlighter:{show:true}
			,legend:{show: true},
			series:[{label:"Player's Skill"},{label:'Top Skill' }]
		})
		
		$(".jqplot-yaxis-tick").hide()
		$(".jqplot-xaxis-tick").hide()
	}, "json")

	$(window).resize(function(){s()})
})

function makeCharts(data,chart_id,text){
	$('#' + chart_id).html("");
	$.jqplot(chart_id, [data],{
		seriesColors: 
			['#078585','#fa573e','#faae3c','#71b07f','#3255A4',
			'#B27700','#F48D37','#3FA3A3','#F4B537'],
		seriesDefaults: {
			renderer:$.jqplot.DonutRenderer,
			rendererOptions: {
				sliceMargin: 3,
				startAngle: -90,
				showDataLabels: true
			},
			textColor: '#000'
		},
		highlighter:{
			show: true,
			useAxesFormatters: false,
			tooltipContentEditor: function(str,seriesIndex,pointIndex,jqplot){
				return kills[pointIndex][0] + "<br>" + text + data[pointIndex][1]
			}
		},
		legend:{
			show: true,
			placement: 'outside',
			location: 'n',
			rendererOptions: {
				numberRows:1
			}
		},
		grid:{
			background: '#f7f7f7'
		},
	});
	$(".chart > .jqplot-table-legend").hide();
	$("#legend").html($("#kill_chart > .jqplot-table-legend").html());
	$('.chart > .jqplot-donut-series').css("color","black");
}

function s(){
	makeCharts(kills,'kill_chart',"Kills: ");
	makeCharts(deaths,'deth_chart',"Deaths: ");

	$("#bellCurve").html("");
	$.jqplot('bellCurve',
			[NormalZ_all(500,player.mu,player.sigma),
			NormalZ_all(500,player.bestMu,player.bestSigma)],
	{ 
		title:'Estimate of Player\'s Skill',
		
		seriesDefaults:{showMarker: false,},

		grid:{background: '#f7f7f7'},
		
		highlighter:{show:true}
		
		,legend:{show: true},
		
		series:[{label:"Player's Skill"},{label:'Top Skill' }]
	});
	$(".jqplot-xaxis-tick").hide();
	$(".jqplot-yaxis-tick").hide();
};
