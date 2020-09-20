const decode = require('unescape');
const axios = require('axios');
const parseString = require('xml2js').parseString;
// player results by id & year
module.exports = (app) => {
    // Player Results
    app.get('/v1/usta/player/:id/results', (req, res) => {
        axios.get("http://tennislink.usta.com/PublicWebServices/TournamentsMobile.asmx/websrvc_get_player_result_history_for_tournaments", {
            params: {
                strMemberID: req.params.id,
                year: req.query.year || 0
            }})
            .then(response => {
                parseString(decode(response.data.toString()), {normalizeTags: true, explicitArray: false, ignoreAttrs: true}, function(err, result) {
                    res.json(result.string.tournaments.tournament);
                });
            });
    });

    // Player Tournaments
    app.get('/v1/usta/player/:id/tournaments', (req, res) => {
        axios.get("http://tennislink.usta.com/PublicWebServices/TournamentsMobile.asmx/websrvc_get_user_tournaments", {
            params: {
                strMemberNum: req.params.id
            }})
            .then(response => {
                parseString(decode(response.data.toString()), {explicitArray: false, ignoreAttrs: true}, function(err, result) {
                    let resp = {name: result.string.userinfo.playername, tournaments: result.string.userinfo.tournaments.tournament};
                    res.json(resp);
                });
            })
    });

    // Tournament Details
    app.get('/v1/usta/tournament', (req, res) => {
        axios.get("http://tennislink.usta.com/PublicWebServices/TournamentsMobile.asmx/websrvc_get_user_tournament_details", {
            params: {
                strTournamentID: req.query.id
            }})
            .then(response => {
                parseString(decode(response.data.toString()), {/*normalizeTags: true, */explicitArray: false, ignoreAttrs: true}, function(err, result) {
                    result.string.tournamentdetails.events = result.string.tournamentdetails.events.event;
                    res.json(result.string.tournamentdetails);
                });
            });
    });
    // Tournament Draws
    app.get('/v1/usta/tournament/draws', (req, res) => {
        axios.get("http://tennislink.usta.com/PublicWebServices/TournamentsMobile.asmx/websrvc_get_Tournament_Draws", {
            params: {
                strTournamentID: req.query.id
            }})
            .then(response => {
                parseString(decode(response.data.toString()), {/*normalizeTags: true, */explicitArray: false, ignoreAttrs: true}, function(err, result) {
                    //let resp = {name: result.string.userinfo.playername, tournaments: result.string.userinfo.tournaments.tournament}
                    //result.string.tournamentdetails.events = result.string.tournamentdetails.events.event;
                    res.json(result.string);
                });
            });
    });
    // Tournament HTML Draws
    app.get('/v1/usta/tournament/draws/html', (req, res) => {
        axios.get("http://tennislink.usta.com/PublicWebServices/TournamentsMobile.asmx/websrvc_get_Tournament_Draws_Html", {
            params: {
                strTournamentID: req.query.id,
                intEventID: req.query.event,
                strSectionCode: req.query.section,
                strDrawType: req.query.type || "M"
            }})
            .then(response => {
                parseString(decode(response.data.toString()), {explicitArray: false, ignoreAttrs: true}, function(err, result) {
                    res.type("html");
                    res.send(result.string.info.html);
                });
            });
    });
    // Tournament Competitors
    app.get('/v1/usta/tournament/competitors', (req, res) => {
        axios.get("http://tennislink.usta.com/PublicWebServices/TournamentsMobile.asmx/websrvc_get_tournament_competitors", {
            params: {
                strTournamentID: req.query.id
            }})
            .then(response => {
                parseString(decode(response.data.toString()), {explicitArray: false, ignoreAttrs: true}, function(err, result) {
                    res.json(result.string.competitors.competitor);
                });
            }).catch(error => {
            res.status(500).json({message: "invalid ID"});
        });
    });
    // Tournament Applicants
    app.get('/v1/usta/tournament/applicants', (req, res) => {
        axios.get("http://tennislink.usta.com/PublicWebServices/TournamentsMobile.asmx/websrvc_get_tournament_applicants", {
            params: {
                TournamentID: req.query.id,
                DivisionID: "-1",
                EventGroupID: "-1"
            }})
            .then(response => {
                parseString(decode(response.data.toString()), {explicitArray: false, ignoreAttrs: true, normalizeTags: true}, function(err, result) {
                    res.json(result.string.applicants.player);
                });
            });
    });
    // Tournament Search
    app.get('/v1/usta/tournament/search', (req, res) => {
        axios.get("http://tennislink.usta.com/PublicWebServices/TournamentsMobile.asmx/websrvc_get_tournament_Search_FinderAdvance", {
            params: {
                keyword: req.query.keyword || "",
                zip: req.query.zip || "",
                radius: req.query.radius || "50",
                start_year: req.query.year || "2020",
                start_month: req.query.month || "",
                division_id: "0",
                category_id: "0",
                surface_id: "0",
                section_code: "",
                district_code: "",
                city: "",
                state_id: "",
                age_group: "",
                skilllevel_entrylevel: "0",
                startdate: "(null)",
                enddate: "(null)",
                quick_search: "0",
                tournament_type: "-1",
            }})
            .then(response => {
                parseString(decode(response.data.toString()), {explicitArray: false, ignoreAttrs: true}, function(err, result) {
                    if(result.string.tournaments) {
                        res.json(result.string.tournaments.tournament);
                    } else {
                        res.json({noResults: true});
                    }
                });
            });
    });
};