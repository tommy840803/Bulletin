package com.nutc;
import java.io.IOException;
import java.util.Date;
import java.util.logging.Logger;
import javax.servlet.http.*;

import com.google.appengine.api.datastore.DatastoreFailureException;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;

import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.labs.repackaged.org.json.JSONArray;
import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.appengine.labs.repackaged.org.json.JSONObject;
import com.google.appengine.api.datastore.Transaction;

@SuppressWarnings("serial")
public class SortbydateServlet extends HttpServlet{
	private static final Logger log = Logger.getLogger(SortbydateServlet.class.getName());

    // Hard code the message board name for simplicity.  
	// boardName <==> primaryKey
    private String boardName = "BulletinofYuan";

    public static String escapeHtmlChars(String inStr) {
        return inStr.replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;");
    }
    // Handle the HTTP request (method = Get)
    public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {

    	DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
    	//查詢資料，並且以時間排序
        Query q = new Query("Bulletin").addSort("post_date",SortDirection.ASCENDING);
        PreparedQuery pq = ds.prepare(q);
        //塞入Json
        JSONArray json = new JSONArray();
        try{
        	
	        for (Entity result : pq.asIterable()) {
	        	long id = result.getKey().getId();
	            String date = result.getProperty("post_date").toString();
	            String title = result.getProperty("title").toString();
	            String content = result.getProperty("content").toString();
				json.put(new JSONObject().put("id",id).put("post_date",date).put("title",title).put("content",content));
	        }
	    	//查詢結果，以Json輸出
			resp.setContentType("text/html;charset=UTF-8");
			resp.getWriter().print(json);
			
        }catch(JSONException e){
        	e.printStackTrace();
        }
	
    }
    
    
    // Handle the HTTP request (method = POST)
    public void doPost(HttpServletRequest req, HttpServletResponse resp)
        throws IOException {

        // Save the message and update the board count in a
        // transaction, retrying up to 3 times.

        DatastoreService ds = DatastoreServiceFactory.getDatastoreService();

		//取得前台資料(標題、內容)
        //時間由後台自行加入
    	Date currentDate = new Date();
		String title = req.getParameter("title");
		String content = req.getParameter("content");

        int retries = 3;
        boolean success = false;
        while (!success && retries > 0) {
            --retries;
            try {
                Transaction txn = ds.beginTransaction();

        		Entity Bulletin = new Entity("Bulletin");
        		// insert value
        		Bulletin.setProperty("post_date",currentDate);
        		Bulletin.setProperty("title", title);
        		Bulletin.setProperty("content",content);
        		ds.put(Bulletin);

                txn.commit();

                // Break out of retry loop.
                success = true;

            } catch (DatastoreFailureException e) {
                // Allow retry to occur.
            }
        }

        if (!success) {
            resp.getWriter().println("新增成功");
            resp.sendRedirect("/welcome");
        } else {
        	resp.getWriter().println("失敗");
            resp.sendRedirect("/welcome");
        }
    }
}

    

