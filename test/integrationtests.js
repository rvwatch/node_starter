var should = require("should");
var request = require("supertest-as-promised");
var server = request.agent('http://localhost:3000');

describe("basic tests", function () {

    it("should return home page", function (done) {
        server
            .get("/")
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                should(res.body.error).equal(undefined);
                done();
            });
    });

    it("should not return profile if not logged in", function (done) {
        server
            .get("/profile")
            .expect(302)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                should(res.headers.location).equal("/");
                should(res.body.error).equal(undefined);
                done();
            });
    });


    it("should return login if not logged in", function (done) {
        server
            .get("/login")
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                should(res.body.error).equal(undefined);
                done();
            });
    });

    it("should redirect to home on logout if not logged in", function (done) {
        server
            .get("/logout")
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                !should(res.text.indexOf("You've logged out.")).equal(-1);
                should(res.status).equal(200);
                should(res.body.error).equal(undefined);
                done();
            });
    });

    it("should redirect to home on logout if logged in", function (done) {
        server
            .post("/login")
            .send({email: 'dev@', password: '1234'})
            .expect(302)
            .catch(function (err) {
                if (err) {
                    return done(err);
                }
            })
            .then(function (res) {
                server
                    .get("/logout")
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        !should(res.text.indexOf("You've logged out.")).equal(-1);
                        should(res.status).equal(200);
                        should(res.body.error).equal(undefined);
                        done();
                    });
            });
    });

    it("should login and redirect to /profile with correct credentials", function (done) {
        server
            .post("/login")
            .send({email: 'dev@', password: '1234'})
            .expect(302)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                should(res.status).equal(302);
                should(res.headers.location).equal("/profile");
                should(res.body.error).equal(undefined);
                done();
            });
    });

    it("should not login and redirect to /login with incorrect credentials", function (done) {
        server
            .post("/login")
            .send({email: 'dev@', password: '1111'})
            .expect(302)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                should(res.status).equal(302);
                should(res.headers.location).equal("/login");
                should(res.body.error).equal(undefined);
                done();
            });
    });

    it("should login and redirect to /profile with correct credentials", function (done) {
        server
            .post("/login")
            .send({email: 'dev@', password: '1234'})
            .expect(302)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                should(res.status).equal(302);
                should(res.headers.location).equal("/profile");
                should(res.body.error).equal(undefined);
                done();
            });
    });

    it("should redirect to profile when hitting login if already logged in", function (done) {
        server
            .post("/login")
            .send({email: 'dev@', password: '1234'})
            .expect(302)
            .catch(function (err) {
                if (err) {
                    return done(err);
                }
            })
            .then(function (res) {
                server
                    .get("/login")
                    .expect(302)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        should(res.status).equal(302);
                        should(res.headers.location).equal("/profile");
                        should(res.body.error).equal(undefined);
                        done();
                    });
            });
    });

    it("should redirect to profile when hitting signup if already logged in", function (done) {
        server
            .post("/login")
            .send({email: 'dev@', password: '1234'})
            .expect(302)
            .catch(function (err) {
                if (err) {
                    return done(err);
                }
            })
            .then(function (res) {
                server
                    .get("/signup")
                    .expect(302)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        should(res.status).equal(302);
                        should(res.headers.location).equal("/profile");
                        should(res.body.error).equal(undefined);
                        done();
                    });
            });
    });
});