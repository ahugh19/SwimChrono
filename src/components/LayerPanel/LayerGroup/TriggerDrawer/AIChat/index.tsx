import { useState } from "react";
import { Input, Button, Card, Spin, message, Row, Descriptions, Typography } from "antd";
import OpenAI from "openai";
import { aiConfig } from "../../../../../utils/aiConfig";
import { TriggerCompType } from "../../../../../types";
import { promptDraftEn } from "../../../../../utils/prompt";
import { TriggerCompSchema } from "../../../../../types/validation";

interface IAIChatProps {
  onAddTriggerFromAI: (triggerComp: TriggerCompType | null) => void;
  onAddTriggerCompArrayFromAI: (triggerCompArray: TriggerCompType[] | null) => void;
}

const { Text, Title, Paragraph } = Typography

// reverse mapping for comparison operators
const compareMapReverse: Record<string, string> = {
  "smaller than (<)": "<",
  "smaller than or equal to (<=)": "<=",
  "equal to (=)": "=",
  "greater than (>)": ">",
  "greater than or equal to (>=)": ">=",
};

// parse a single TriggerCompType
function parseSingleTriggerComp(response: string | null): TriggerCompType | null {
  if (!response) return null;
  try {
    const parsed = JSON.parse(response);
    return TriggerCompSchema.parse(parsed);
  } catch (error) {
    console.error("Invalid single TriggerCompType:", error);
    return null;
  }
}

// parse a TriggerCompType array
function parseTriggerCompArray(response: string | null): TriggerCompType[] | null {
  if (!response) return null;
  try {
    const parsed = JSON.parse(response);
    return TriggerCompSchema.array().parse(parsed);
  } catch (error) {
    console.error("Invalid TriggerCompType array:", error);
    return null;
  }
}

const extractJSON = (str: string | null) => {
  if (!str) return null
  const match = str.match(/```json\n([\s\S]*?)\n```/);
  return match ? match[1] : str;
};


function AIChat(props: IAIChatProps) {

  const { onAddTriggerFromAI, onAddTriggerCompArrayFromAI } = props;

  const [input, setInput] = useState(""); // user input
  // const [response, setResponse] = useState<string | null>("");
  const [responseTriggerComp, setResponseTriggerComp] = useState<TriggerCompType | null>(null);
  const [responseTriggerCompArray, setResponseTriggerCompArray] = useState<TriggerCompType[] | null>(null);
  const [isArray, setIsArray] = useState<boolean>(false);
  const [loading, setLoading] = useState(false); // loading state

  const askAI = async () => {
    if (!input.trim()) {
      message.warning("Please describe your trigger.");
      return;
    }

    if (!aiConfig.isConfigured) {
      message.error("AI assistant is not configured. Copy .env.example to .env and fill in VITE_AI_API_KEY.");
      return;
    }

    setLoading(true);
    try {
      const openai = new OpenAI({
        baseURL: aiConfig.baseURL,
        apiKey: aiConfig.apiKey,
        dangerouslyAllowBrowser: true,
      });

      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: promptDraftEn },
          { role: "user", content: input }
        ],
        model: aiConfig.model,
      });
      console.log(completion.choices[0].message.content)
      const jsonStr = extractJSON(completion.choices[0].message.content)
      console.log(jsonStr)
      // setResponse(completion.choices[0].message.content);
      if (jsonStr) {
        if (Array.isArray(JSON.parse(jsonStr))) {
          setIsArray(true)
          setResponseTriggerCompArray(parseTriggerCompArray(jsonStr))
        } else {
          setIsArray(false)
          setResponseTriggerComp(parseSingleTriggerComp(jsonStr))
        }
      }
    } catch (error) {
      message.error("Error fetching AI response");
      console.error("Error fetching AI response", error);
    } finally {
      setLoading(false);
    }
  };

  function onAddClick() {
    if (!responseTriggerComp) return;
    onAddTriggerFromAI(responseTriggerComp)
  }

  function onAddArrayClick() {
    if (!responseTriggerCompArray) return;
    onAddTriggerCompArrayFromAI(responseTriggerCompArray)
  }

  return (
    <Card style={{ maxWidth: 330, marginBottom: "20px" }}>
      <Row style={{ marginBottom: 20 }}>
        <Title level={5} style={{ margin: "0 0 10px 0" }}>
          User-input trigger description</Title>
        <Paragraph>E.g., <Text italic>"Show the visualization when the distance is 30m. Visualization lasts for 6 seconds"</Text> or <Text italic>"30m 6s."</Text></Paragraph>
      </Row>
      <Input.TextArea
        rows={3}
        placeholder={"Describe your trigger..."}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Row justify="end" style={{ marginTop: 10 }}>
        <Button type="primary" onClick={askAI} disabled={loading}>
          AI Interpret
        </Button>
      </Row>

      {
        loading ? (
          <Spin style={{ marginTop: 20 }} />
        ) :
          (
            isArray ?
              (
                responseTriggerCompArray && (
                  <>
                    <b>Your trigger:</b>
                    <>
                      {
                        responseTriggerCompArray.map((r, i) => {
                          return <Descriptions key={`ai-response-trigger-${i}`} bordered column={1} style={{ marginTop: 10 }} size="small">
                            <Descriptions.Item label="Name">{r.name}</Descriptions.Item>
                            <Descriptions.Item label="Type">{r.triggerType}</Descriptions.Item>
                            <Descriptions.Item label="Start Condition">
                              {r.subjectStart} {compareMapReverse[r.compareStart]} {r.valueStart}
                            </Descriptions.Item>
                            <Descriptions.Item label="End Condition">
                              {r.subjectEnd} {compareMapReverse[r.compareEnd]} {r.valueEnd}
                            </Descriptions.Item>
                            <Descriptions.Item label="Priority">{r.priority}</Descriptions.Item>
                          </Descriptions>
                        })
                      }
                    </>
                    <Row justify="end" style={{ marginTop: 10 }}>
                      <Button type="primary" onClick={onAddArrayClick} disabled={loading}>
                        Add for editing
                      </Button>
                    </Row>
                  </>
                )
              )
              :
              (
                responseTriggerComp && (
                  <>
                    <b>Your trigger:</b>
                    <Descriptions bordered column={1} style={{ marginTop: 10 }} size="small">
                      <Descriptions.Item label="Name">{responseTriggerComp.name}</Descriptions.Item>
                      <Descriptions.Item label="Type">{responseTriggerComp.triggerType}</Descriptions.Item>
                      <Descriptions.Item label="Start Condition">
                        {responseTriggerComp.subjectStart} {compareMapReverse[responseTriggerComp.compareStart]} {responseTriggerComp.valueStart}
                      </Descriptions.Item>
                      <Descriptions.Item label="End Condition">
                        {responseTriggerComp.subjectEnd} {compareMapReverse[responseTriggerComp.compareEnd]} {responseTriggerComp.valueEnd}
                      </Descriptions.Item>
                      <Descriptions.Item label="Priority">{responseTriggerComp.priority}</Descriptions.Item>
                    </Descriptions>
                    <Row justify="end" style={{ marginTop: 10 }}>
                      <Button type="primary" onClick={onAddClick} disabled={loading}>
                        Add for editing
                      </Button>
                    </Row>
                  </>
                )
              )
          )
      }
    </Card>
  );
};

export default AIChat;
