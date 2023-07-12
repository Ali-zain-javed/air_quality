import React, { useState } from "react";
import {
  Container,
  Form,
  Message,
  Grid,
  Segment,
  Header,
  Button,
} from "semantic-ui-react";
import axios from "axios";
import "./style.css";
import Image from "../Assets/hero.webp";

const AirQualityTool = () => {
  const [city1, setCity1] = useState("");
  const [city2, setCity2] = useState("");
  const [city1Data, setCity1Data] = useState(null);
  const [city2Data, setCity2Data] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCity1Change = (event) => {
    setCity1(event.target.value);
  };

  const handleCity2Change = (event) => {
    setCity2(event.target.value);
  };

  //handle submit and openApi call for data
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setFinalResult(null);
    let firstValue, secondValue;
    try {
      //this is for city one
      const response1 = await axios.get(
        `https://api.openaq.org/v1/measurements?city=${city1}`
      );

      if (response1?.data?.results && response1?.data?.results?.length > 0) {
        let heighest;
        for (let item of response1?.data?.results) {
          if (!heighest) {
            heighest = item;
          } else {
            if (heighest?.value < item?.value) {
              heighest = item;
            }
          }
        }
        let resultData = [];
        if (heighest) {
          resultData.push(heighest);
        }
        firstValue = heighest;
        setCity1Data(resultData);
      } else {
        setCity1Data("No Data found");
      }
    } catch (error) {
      setError(`Failed to fetch data for ${city1}`);
    }
    ///this is for city 2
    try {
      const response2 = await axios.get(
        `https://api.openaq.org/v1/measurements?city=${city2}`
      );

      if (response2?.data?.results && response2?.data?.results?.length > 0) {
        let heighest;
        for (let item of response2?.data?.results) {
          if (!heighest) {
            heighest = item;
          } else {
            if (heighest?.value < item?.value) {
              heighest = item;
            }
          }
        }
        let resultData = [];
        if (heighest) {
          resultData.push(heighest);
        }
        secondValue = heighest;
        setCity2Data(resultData);
      } else {
        setCity2Data("No Data found");
      }
    } catch (error) {
      setError(`Failed to fetch data for ${city1}`);
    }

    if (firstValue?.value > secondValue?.value) {
      setFinalResult([
        {
          finalCity: ` ${city2} has a better Air quality`,
          difference: firstValue?.value - secondValue?.value,
        },
      ]);
    } else {
      setFinalResult([
        {
          finalCity: `${city1} has a better Air quality`,
          difference: firstValue?.value - secondValue?.value,
        },
      ]);
    }

    setLoading(false);
  };

  function getAllKeysAndValues(obj) {
    const keys = [];

    function traverseObject(obj) {
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          //   values.push(obj[key]);

          if (typeof obj[key] === "object") {
            traverseObject(obj[key]); // Recursive call for nested objects
          } else {
            keys.push({ key: key, value: obj[key] });
          }
        }
      }
    }

    traverseObject(obj);

    return keys?.map((item) => {
      return (
        <div style={{ padding: "4px", display: "flex" }}>
          <span style={{ padding: "4px" }}>
            <span style={{ fontWeight: "bold" }}>{item?.key}</span>
            {" : "}
            {item?.value}
          </span>
        </div>
      );
    });
  }
  return (
    <section className="hero-section">
      <div className="hero-title">
        <h1 className="type-display-1 text-sky-120">
          Air Quality Assessment Tool
        </h1>
        <React.Fragment>
          <Container
            style={{
              marginTop: "2rem",
              //   backgroundColor: "blue",
            }}>
            <Segment>
              <Form onSubmit={handleSubmit} style={{ display: "flex" }}>
                <Form.Field>
                  <label>City 1</label>
                  <input
                    placeholder="Enter City 1"
                    value={city1}
                    onChange={handleCity1Change}
                    // required
                  />
                </Form.Field>
                <Button type="submit" className="btn-primary">
                  {loading ? "Loading..." : " Compare Air Quality"}
                </Button>
                <Form.Field>
                  <label>City 2</label>
                  <input
                    placeholder="Enter City 2"
                    value={city2}
                    onChange={handleCity2Change}
                    // required
                  />
                </Form.Field>
              </Form>
            </Segment>
          </Container>
          <div
            style={{
              marginTop: "2rem",
            }}>
            {error && <Message negative>{error}</Message>}

            <Grid
              columns={3}
              stackable
              style={{ marginTop: "2rem", display: "flex", padding: "8px" }}>
              {(city1Data &&
                city1Data?.map?.((item) => {
                  return (
                    <Grid.Column style={{ minWidth: "120px" }}>
                      <Segment>
                        <Header as="h3">City: {city1 || item?.location}</Header>
                        <span>{getAllKeysAndValues(item)}</span>
                      </Segment>
                    </Grid.Column>
                  );
                })) || (
                <Grid.Column style={{ minWidth: "120px", textAlign: "center" }}>
                  <Segment>
                    <span>No data found</span>
                  </Segment>
                </Grid.Column>
              )}
              {(finalResult &&
                finalResult?.map?.((item) => {
                  return (
                    <Grid.Column style={{ minWidth: "120px" }}>
                      <Segment>
                        <Header as="h3">{item?.finalCity}</Header>
                        <span>{getAllKeysAndValues(item)}</span>
                      </Segment>
                    </Grid.Column>
                  );
                })) || (
                <Grid.Column style={{ minWidth: "120px", textAlign: "center" }}>
                  <Segment>
                    <span>No data found</span>
                  </Segment>
                </Grid.Column>
              )}
              {(city2Data &&
                city2Data?.map?.((item) => {
                  return (
                    <Grid.Column style={{ minWidth: "120px" }}>
                      <Segment>
                        <Header as="h3">City: {city2 || item?.location}</Header>
                        <span>{getAllKeysAndValues(item)}</span>
                      </Segment>
                    </Grid.Column>
                  );
                })) || (
                <Grid.Column style={{ minWidth: "120px", textAlign: "center" }}>
                  <Segment>
                    <span>No data found</span>
                  </Segment>
                </Grid.Column>
              )}
            </Grid>
          </div>
        </React.Fragment>
      </div>
      <div className="hero-image">
        <div className="bubble-lg"></div>
        <div className="bubble-md"></div>
        <div className="bubble-sm"></div>
        <img src={Image} alt="" className="hero-image__img" />
        <div className="active-marker">
          <span>58</span>
        </div>
      </div>
    </section>
  );
};

export default AirQualityTool;
