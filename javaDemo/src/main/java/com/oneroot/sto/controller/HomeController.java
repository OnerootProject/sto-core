package com.oneroot.sto.controller;

import com.alibaba.fastjson.JSON;
import com.oneroot.sto.entity.Message;
import com.oneroot.sto.service.LoadDataService;
import com.oneroot.sto.service.VerifySignService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.TreeMap;

@Controller
@EnableAutoConfiguration
public class HomeController {
    private final static Logger log = LoggerFactory.getLogger(HomeController.class);

    @Autowired
    LoadDataService loadDataService;

    @Autowired
    VerifySignService verifySignService;

    @RequestMapping("/")
    public String index(ModelMap model) {
        TreeMap<Object, HashMap> apis = loadDataService.loadData();
//        log.debug("apis:"+apis.toString());
        String apisJson = JSON.toJSONString(apis, true);
        log.debug("apisJson:"+apisJson);
        model.addAttribute("apis_json", apisJson);
        model.addAttribute("apis", apis);
        return "home";
    }

    @RequestMapping("/verifySign")
    @ResponseBody
    public Message verifySign(String account, String msg, String signature) {
        Message res = new Message();

        if(verifySignService.verify(account,msg,signature)) {
            res.success();
        } else {
            res.failure();
        }

        return res;
    }

}
