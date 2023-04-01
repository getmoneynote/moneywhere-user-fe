import {useRef,useEffect} from "react";
import {message} from "antd";
import { ModalForm } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import t from "@/utils/i18n";

export default (props) => {

  const {
    title,
    width = 600,
    labelWidth,
    initialValues,
    request,
    params,
    onSuccess,
    autoFocusFirstInput = false,
    isKeyPressSubmit = true,
  } = props;

  const formRef = useRef();
  const { visible, setVisible } = useModel('modal');

  const successMsg = t('message.operation.success');
  const finishHandler = async (values) => {
    await request({...values, ...params});
    message.success(successMsg);
    formRef.current?.resetFields();
    if (onSuccess) onSuccess();
    return true;
  }

  useEffect(() => {
    // 加visible是为了每次打开都执行一次，清空前面的输入
    if (visible && initialValues && Object.keys(initialValues).length > 0) {
      // 把之前的输入清空，因为有些输入项没有被initialValues包含。
      formRef.current?.resetFields();
      formRef.current?.setFieldsValue({...initialValues});
    }
  }, [initialValues, visible]);

  return (
    <ModalForm
      width={width}
      layout="horizontal"
      grid={true}
      labelCol={{ style: { width: labelWidth } }}
      title={title}
      formRef={formRef}
      open={visible}
      onOpenChange={setVisible}
      onFinish={finishHandler}
      dateFormatter={value => value.valueOf()}
      modalProps={{destroyOnClose: false}}
      autoFocusFirstInput={autoFocusFirstInput}
      isKeyPressSubmit={isKeyPressSubmit}
      // submitter={{
      //   render: (props, defaultDoms) => {
      //     return [
      //       ...defaultDoms,
      //       <Button onClick={() => { props.reset() }}>{t('reset')}</Button>,
      //     ];
      //   },
      // }}
    >
      {props.children}
    </ModalForm>
  );

}
