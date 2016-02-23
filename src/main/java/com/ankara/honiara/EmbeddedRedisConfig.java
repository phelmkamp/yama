package com.ankara.honiara;

import java.io.IOException;
import java.net.ServerSocket;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.BeanDefinitionRegistryPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import redis.embedded.RedisServer;

@Configuration
public class EmbeddedRedisConfig {

	@Bean
	public static RedisServerBean redisServer() {
		return new RedisServerBean();
	}

	/**
	 * Implements BeanDefinitionRegistryPostProcessor to ensure this Bean is initialized
	 * before any other Beans. Specifically, we want to ensure that the Redis Server is
	 * started before RedisHttpSessionConfiguration attempts to enable Keyspace
	 * notifications.
	 */
	static class RedisServerBean implements InitializingBean, DisposableBean,
			BeanDefinitionRegistryPostProcessor, RedisConnectionProperties {
		private RedisServer redisServer;

		public void afterPropertiesSet() throws Exception {
			redisServer = new RedisServer(getPort());
			redisServer.start();
		}

		public void destroy() throws Exception {
			if (redisServer != null) {
				redisServer.stop();
			}
		}

		public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry)
				throws BeansException {
		}

		public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory)
				throws BeansException {
		}

		private Integer availablePort;

		public int getPort() throws IOException {
			if (availablePort == null) {
				ServerSocket socket = new ServerSocket(0);
				availablePort = socket.getLocalPort();
				socket.close();
			}
			return availablePort;
		}
	}
}
