import { Row, Flex, InputNumber, Col, Input } from "antd"

const { TextArea } = Input

function CssController() {
  return (
    <div>
      <Row style={{ height: "20px", lineHeight: "20px", fontSize: "14px", fontWeight: 500 }}>
        CSS
      </Row>
      <Flex style={{ marginTop: "10px" }} gap={"small"} justify={"flex-start"} align={"center"}>
        <Row style={{width: "80%"}}>
          <TextArea rows={7} />
        </Row>
      </Flex>
    </div>
  )
}

export default CssController